import { db } from '../config/database';
import { generateUUID } from '../utils/hash';

export interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    property_id?: string;
    status: string;
    dedup_hash?: string;
    source_ip?: string;
    crm_synced: boolean;
    crm_synced_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface CreateEnquiryData {
    name: string;
    email: string;
    phone?: string;
    message: string;
    property_id?: string;
    dedup_hash: string;
    source_ip?: string;
}

export const enquiryRepository = {

    create: async (data: CreateEnquiryData): Promise<Enquiry> => {
        const id = generateUUID();
        await db('enquiries').insert({
            id,
            ...data,
            status: 'pending',
            crm_synced: false,
        });
        return enquiryRepository.findById(id) as Promise<Enquiry>;
    },

    findById: async (id: string): Promise<Enquiry | null> => {
        const row = await db('enquiries').where({ id }).first();
        return row || null;
    },

    findByDedupHash: async (hash: string): Promise<Enquiry | null> => {
        const row = await db('enquiries').where({ dedup_hash: hash }).first();
        return row || null;
    },

    findAll: async (
        limit: number,
        offset: number,
        filters: { status?: string } = {}
    ): Promise<{ rows: Enquiry[]; total: number }> => {
        const query = db('enquiries');
        if (filters.status) query.where({ status: filters.status });

        const [rows, countResult] = await Promise.all([
            query.clone().select('*').orderBy('created_at', 'desc').limit(limit).offset(offset),
            query.clone().count('id as count').first(),
        ]);

        return {
            rows,
            total: parseInt((countResult as any)?.count || '0', 10),
        };
    },

    markCrmSynced: async (id: string): Promise<void> => {
        await db('enquiries').where({ id }).update({
            crm_synced: true,
            crm_synced_at: new Date(),
        });
    },
};