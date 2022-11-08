import { redisClient } from 'core/cache/redisClient';
import { Request, Response, NextFunction } from 'express';

const set = async (key: string, value: any, ttlSeconds = 5) => {
    await redisClient.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
    });
};

const get = async (key: string) => {
    const cachedValue = await redisClient.get(key);

    return cachedValue && JSON.parse(cachedValue);
};

export const cacheClient = {
    get,
    set,
};
