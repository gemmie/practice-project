import { redisClient } from 'core/cache/redisClient';
import { Request, Response, NextFunction } from 'express';

export const getDataFromCache = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cacheKey = req.url;

    const cachedValue = await get(cacheKey);

    if (cachedValue) {
        console.log('cache HIT');
        res.send(cachedValue);
        return;
    }

    next();
};

const set = async (key: string, value: any) => {
    await redisClient.set(key, JSON.stringify(value), {
        EX: 5,
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
