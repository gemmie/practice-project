import * as dotenv from 'dotenv';
import { redisClient } from 'core/cache/redisClient';
import { receiveMsg } from 'core/queue/sqsClient';
import { handleCacheInvalidateMsg } from 'core/queue/cacheQueueHandler';

dotenv.config();

redisClient.connect().then(() => {
    receiveMsg({ handleMessage: handleCacheInvalidateMsg });
});
