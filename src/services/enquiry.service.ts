import { enquiryRepository } from '../repositories/enquiry.repository';
import { cacheManager } from '../cache/cacheManager';
import { generateDedupHash } from '../utils/hash';
import { sanitiseEnquiry } from '../utils/sanitise';
import { CACHE_KEYS, TTL } from '../cache/keys';
import { crmQueue } from '../queues/crm.queue';

export const enquiryService = {

    create: async (data: any, sourceIp: string) => {
        const clean = sanitiseEnquiry(data);
        const dedupHash = generateDedupHash(clean.email, clean.phone || '', clean.message);

        // Check if duplicate exists
        const existing = await enquiryRepository.findByDedupHash(dedupHash);
        if (existing) {
            throw new Error('Duplicate enquiry detected');
        }

        // Create enquiry
        const enquiry = await enquiryRepository.create({
            ...clean,
            dedup_hash: dedupHash,
            source_ip: sourceIp,
        });

        // Enqueue CRM sync job
        await crmQueue.add('sync', { enquiry_id: enquiry.id });

        // Cache it
        await cacheManager.set(CACHE_KEYS.ENQUIRY(enquiry.id), enquiry, TTL.ENQUIRY);

        return enquiry;
    },

    getById: async (id: any) => {
        const cached = await cacheManager.get(CACHE_KEYS.ENQUIRY(id));
        if (cached) return cached;

        const enquiry = await enquiryRepository.findById(id);
        if (enquiry) {
            await cacheManager.set(CACHE_KEYS.ENQUIRY(id), enquiry, TTL.ENQUIRY);
        }
        return enquiry;
    },

    listAll: async (page: number, limit: number, status?: string) => {
        const { rows, total } = await enquiryRepository.findAll(limit, (page - 1) * limit, { status });
        return { rows, total, page, limit };
    },
};