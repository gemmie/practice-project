import { redisClient } from './core/cache/redisClient';
import { receiveMsg } from './core/queue/sqsClient';
import { handleCacheInvalidateMsg } from './core/queue/cacheQueueHandler';

export const createQueueWorker = () => {
    const start = async () => {
        await redisClient.connect().then(() => {
            receiveMsg({ handleMessage: handleCacheInvalidateMsg });
        });
    };

    const cleanup = async () => {
        await redisClient.disconnect();
    };

    return {
        start,
        cleanup,
    };
};
