import NodeCache from 'node-cache';
import { CacheClient } from 'core/cache/types';

const inMemoryCache = new NodeCache({
    stdTTL: 2,
    checkperiod: 60,
});

export const inMemoryCacheClient: CacheClient = {
    get: <T>(key: string) => Promise.resolve(inMemoryCache.get<T>(key)),
    set: <T>(key: string, value: T, ttlSeconds?: number) =>
        Promise.resolve(
            ttlSeconds
                ? inMemoryCache.set(key, value, ttlSeconds)
                : inMemoryCache.set(key, value)
        ),
    del: (key: string) => Promise.resolve(inMemoryCache.del(key)),
};
