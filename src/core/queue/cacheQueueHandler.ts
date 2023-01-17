import { InvalidateCacheMessage } from './types';
import { sendMsg } from './sqsClient';
import { combinedCacheClient } from '../cache/combinedCacheClient';

const getInvalidateCacheMessage = (key: string): InvalidateCacheMessage => {
    return {
        cacheKey: key,
    };
};
export const sendInvalidateCacheMsg = async (key: string) => {
    const message = getInvalidateCacheMessage(key);

    await sendMsg(message);
};

export const handleCacheInvalidateMsg = async (
    message: InvalidateCacheMessage
) => {
    const { cacheKey } = message;

    combinedCacheClient.del(cacheKey);
};
