import { redisClient } from 'core/cache/redisClient';
import { CacheClient } from 'core/cache/types';

const set = async (key: string, value: any, ttlSeconds = 5) => {
    await redisClient.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
    });
};

const get = async <T>(key: string): Promise<T> => {
    const cachedValue = await redisClient.get(key);
    return cachedValue && JSON.parse(cachedValue);
};

export const cacheClient: CacheClient = {
    get,
    set,
};
