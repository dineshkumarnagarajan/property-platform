import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis';

export const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    store: new RedisStore({
        sendCommand: async (...args: string[]) => {
            return await (redis as any).call(...args);
        },
    }),
    message: { error: 'Too many requests, try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});