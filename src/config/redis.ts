import Redis from 'ioredis';
import { config } from './index';

export const redis: any = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    maxRetriesPerRequest: null,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err: any) => console.error('Redis error:', err.message));