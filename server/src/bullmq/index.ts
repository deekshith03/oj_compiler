import Redis from 'ioredis';

export const bullmqConnection: Redis.Redis = new Redis.default({
    host: process.env.REDIS_HOST ?? 'localhost',
    maxRetriesPerRequest: null,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
});
