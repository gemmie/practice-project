import { combinedCacheClient } from './combinedCacheClient';

export const withCombinedCache = async <T>(
    key: string,
    getValue: () => Promise<T>,
    ttlSeconds: number
) => {
    const cachedValue = await combinedCacheClient.get<T>(key);

    if (cachedValue) {
        console.log('hit');
        return cachedValue;
    }

    console.log('miss');
    const value = await getValue();

    await combinedCacheClient.set(key, value, ttlSeconds);

    return value;
};
