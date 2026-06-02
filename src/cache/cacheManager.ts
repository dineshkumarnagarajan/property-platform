import { redis } from '../config/redis';

export const cacheManager = {
    get: async <T>(key: string): Promise<T | null> => {
        const raw = await redis.get(key);
        return raw ? JSON.parse(raw) : null;
    },

    set: async (key: string, value: unknown, ttl = 60): Promise<void> => {
        await redis.setex(key, ttl, JSON.stringify(value));
    },

    delete: async (key: string): Promise<void> => {
        await redis.del(key);
    },

    deleteByPattern: async (pattern: string): Promise<void> => {
        const keys = await redis.keys(pattern);
        if (keys.length) await redis.del(...keys);
    },
};