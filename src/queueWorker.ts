import { redisClient } from './core/cache/redisClient';
import { receiveMsg } from './core/queue/sqsClient';
import { handleCacheInvalidateMsg } from './core/queue/cacheQueueHandler';

export const createQueueWorker = () => {
    let clearInterval: (() => void) | undefined = undefined;
    const start = async () => {
        console.log('start');
        await redisClient.connect().then(() => {
            console.log('redis connected');
            clearInterval = receiveMsg({
                handleMessage: handleCacheInvalidateMsg,
            });
        });
    };

    const cleanup = async () => {
        clearInterval && clearInterval();
        await redisClient.disconnect();
    };

    return {
        start,
        cleanup,
    };
};
