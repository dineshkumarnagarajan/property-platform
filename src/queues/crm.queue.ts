import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const crmQueue = new Queue('crm-sync', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
    },
});