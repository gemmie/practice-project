import { cacheClient } from 'core/cache/cacheClient';
import { inMemoryCacheClient } from 'core/cache/inMemoryCacheClient';
import { combinedCacheClient2Factory } from 'core/cache/combinedCacheClient2';

export const combinedCacheClient2 = combinedCacheClient2Factory(
    cacheClient,
    inMemoryCacheClient,
    console.log
);
