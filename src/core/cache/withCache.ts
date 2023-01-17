import { cacheClient } from './cacheClient';

export const withCache = async <T>(
    key: string,
    getValue: () => Promise<T>,
    ttlSeconds: number
) => {
    const cachedValue = await cacheClient.get<T>(key);

    if (cachedValue) {
        console.log('hit');
        return cachedValue;
    }

    console.log('miss');
    const value = await getValue();

    await cacheClient.set(key, value, ttlSeconds);

    return value;
};
