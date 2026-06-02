import Redis from 'ioredis';
import { config } from './index';

export const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err.message));