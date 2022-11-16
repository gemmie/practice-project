import { InvalidateCacheMessage } from 'core/queue/types';
import { sendMsg } from 'core/queue/sqsClient';
import { combinedCacheClient } from 'core/cache/combinedCacheClient';

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
