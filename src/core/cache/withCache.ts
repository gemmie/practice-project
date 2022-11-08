import { cacheClient } from 'core/cache/cacheClient';

export const withCache = async (
    key: string,
    getValue: () => Promise<any>,
    ttlSeconds: number
) => {
    const cachedValue = await cacheClient.get(key);

    if (cachedValue) {
        console.log('hit');
        return cachedValue;
    }

    console.log('miss');
    const value = await getValue();

    await cacheClient.set(key, value, ttlSeconds);

    return value;
};
