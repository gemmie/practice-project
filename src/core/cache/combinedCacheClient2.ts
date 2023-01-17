import { CacheClient } from './types';

export const combinedCacheClient2Factory = (
    redisCacheClient: CacheClient,
    inMemoryCacheClient: CacheClient,
    logger: (log: string) => void
): CacheClient => {
    const set = async (key: string, value: any, ttlSeconds?: number) => {
        await inMemoryCacheClient.set(key, value);
        await redisCacheClient.set(key, value, ttlSeconds);
    };

    const get = async <T>(key: string) => {
        const inMemoryCacheValue = await inMemoryCacheClient.get<T>(key);
        if (inMemoryCacheValue) {
            logger('in memory');
            return inMemoryCacheValue;
        }

        const cachedValue = await redisCacheClient.get<T>(key);

        if (cachedValue) {
            logger('redis');
            await inMemoryCacheClient.set<T>(key, cachedValue);
        }

        return cachedValue;
    };

    const del = async (key: string) => {
        await redisCacheClient.del(key);
        await inMemoryCacheClient.del(key);
    };

    return {
        get,
        set,
        del,
    };
};
