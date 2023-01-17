import { cacheClient } from './cacheClient';
import { inMemoryCacheClient } from './inMemoryCacheClient';
import { combinedCacheClient2Factory } from './combinedCacheClient2';

export const combinedCacheClient2 = combinedCacheClient2Factory(
    cacheClient,
    inMemoryCacheClient,
    console.log
);
