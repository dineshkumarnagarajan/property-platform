import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import { crmService } from '../services/crm.service';
import { enquiryRepository } from '../repositories/enquiry.repository';
import { logger } from '../utils/logger';

const crmWorker = new Worker('crm-sync', async (job) => {
    const { enquiry_id } = job.data;
    await crmService.syncToCRM(enquiry_id);
    await enquiryRepository.markCrmSynced(enquiry_id);
}, { connection: redis, concurrency: 5 });

crmWorker.on('completed', (job) => logger.info(`Job ${job.id} completed`));
crmWorker.on('failed', (job, err) => logger.error(`Job ${job?.id} failed:`, err));

logger.info('Workers started');