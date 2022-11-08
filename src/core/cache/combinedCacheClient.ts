import { CacheClient } from 'core/cache/types';
import { inMemoryCacheClient } from 'core/cache/inMemoryCacheClient';
import { cacheClient } from 'core/cache/cacheClient';

const set = async (key: string, value: any, ttlSeconds?: number) => {
    await inMemoryCacheClient.set(key, value);
    await cacheClient.set(key, value, ttlSeconds);
};

const get = async <T>(key: string) => {
    const inMemoryCacheValue = await inMemoryCacheClient.get<T>(key);
    if (inMemoryCacheValue) {
        console.log('in memory');
        return inMemoryCacheValue;
    }

    const cachedValue = await cacheClient.get<T>(key);

    if (cachedValue) {
        console.log('redis');
        await inMemoryCacheClient.set<T>(key, cachedValue);
    }

    return cachedValue;
};

export const combinedCacheClient: CacheClient = {
    get,
    set,
};
