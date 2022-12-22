import { combinedCacheClient } from './combinedCacheClient';
import { inMemoryCacheClient } from './inMemoryCacheClient';
import { cacheClient } from './cacheClient';

jest.mock('./cacheClient');
jest.mock('./inMemoryCacheClient');
console.log = jest.fn();

const key = 'key';
const value = 'value';
const ttlSeconds = 10;

describe('combined cache client', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should set value in both storages', async () => {
        expect.assertions(2);

        await combinedCacheClient.set(key, value, ttlSeconds);

        expect(cacheClient.set).toHaveBeenCalledWith(key, value, ttlSeconds);
        expect(inMemoryCacheClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should delete value in both storages', async () => {
        expect.assertions(2);

        await combinedCacheClient.del(key);

        expect(cacheClient.del).toHaveBeenCalledWith(key);
        expect(inMemoryCacheClient.del).toHaveBeenCalledWith(key);
    });

    it('should get value from in memory', async () => {
        (inMemoryCacheClient.get as jest.Mock).mockReturnValue(value);

        expect.assertions(3);

        const cachedValue = await combinedCacheClient.get(key);

        expect(cachedValue).toEqual(value);
        expect(console.log).toHaveBeenCalledWith('in memory');
        expect(cacheClient.get).not.toHaveBeenCalled();
    });

    it('should get value from redis cache', async () => {
        (cacheClient.get as jest.Mock).mockReturnValue(value);

        expect.assertions(4);

        const cachedValue = await combinedCacheClient.get(key);

        expect(cachedValue).toEqual(value);
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('redis');
        expect(inMemoryCacheClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should return undefined when no cached value', async () => {
        expect.assertions(3);

        const cachedValue = await combinedCacheClient.get(key);

        expect(cachedValue).toBeUndefined();
        expect(inMemoryCacheClient.get).toHaveBeenCalledWith(key);
        expect(cacheClient.get).toHaveBeenCalledWith(key);
    });
});
