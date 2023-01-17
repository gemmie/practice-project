import { mock } from 'jest-mock-extended';
import { combinedCacheClient2Factory } from './combinedCacheClient2';
import { CacheClient } from './types';

const cacheClient = mock<CacheClient>();
const inMemoryCacheClient = mock<CacheClient>();
const logger = jest.fn();

const key = 'key';
const value = 'value';
const ttlSeconds = 10;

const combinedCacheClient2 = combinedCacheClient2Factory(
    cacheClient,
    inMemoryCacheClient,
    logger
);

describe('combined cache client', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should set value in both storages', async () => {
        expect.assertions(2);

        await combinedCacheClient2.set(key, value, ttlSeconds);

        expect(cacheClient.set).toHaveBeenCalledWith(key, value, ttlSeconds);
        expect(inMemoryCacheClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should delete value in both storages', async () => {
        expect.assertions(2);

        await combinedCacheClient2.del(key);

        expect(cacheClient.del).toHaveBeenCalledWith(key);
        expect(inMemoryCacheClient.del).toHaveBeenCalledWith(key);
    });

    it('should get value from in memory', async () => {
        inMemoryCacheClient.get.mockReturnValue(Promise.resolve(value));

        expect.assertions(3);

        const cachedValue = await combinedCacheClient2.get(key);

        expect(cachedValue).toEqual(value);
        expect(logger).toHaveBeenCalledWith('in memory');
        expect(cacheClient.get).not.toHaveBeenCalled();
    });

    it('should get value from redis cache', async () => {
        cacheClient.get.mockReturnValue(Promise.resolve(value));

        expect.assertions(4);

        const cachedValue = await combinedCacheClient2.get(key);

        expect(cachedValue).toEqual(value);
        expect(logger).toHaveBeenCalledTimes(1);
        expect(logger).toHaveBeenCalledWith('redis');
        expect(inMemoryCacheClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should return undefined when no cached value', async () => {
        expect.assertions(3);

        const cachedValue = await combinedCacheClient2.get(key);

        expect(cachedValue).toBeUndefined();
        expect(inMemoryCacheClient.get).toHaveBeenCalledWith(key);
        expect(cacheClient.get).toHaveBeenCalledWith(key);
    });
});
