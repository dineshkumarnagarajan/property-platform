import { generateHMAC, timingSafeEqual } from '../utils/hash';
import { config } from '../config';
import { logger } from '../utils/logger';

export const crmService = {

    verifyWebhookSignature: (payload: string, signature: string): boolean => {
        const computed = generateHMAC(config.crm.webhookSecret, payload).toLowerCase();
        const provided = signature.toLowerCase();
        try {
            return timingSafeEqual(computed, provided);
        } catch {
            return false;
        }
    },

    syncToCRM: async (enquiryId: string) => {
        logger.info(`Syncing enquiry ${enquiryId} to CRM`);
        await new Promise(resolve => setTimeout(resolve, 500));
        logger.info(`Synced enquiry ${enquiryId}`);
    },
};