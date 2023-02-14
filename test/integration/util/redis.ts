import { createClient } from 'redis';

export const redisClient = createClient({
    url: 'redis://localhost:6377',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
