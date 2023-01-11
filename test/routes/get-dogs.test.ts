import request from 'supertest';
import { createApp } from '../../src/app';
import nock from 'nock';
import { checkNockIsDone } from '../util/nock';
import { Application } from 'express';
import { redisClient } from '../../src/core/cache/redisClient';
import { inMemoryCache } from '../../src/core/cache/inMemoryCacheClient';

const mockDogApi = () =>
    nock('https://dog.ceo')
        .get('/api/breeds/list/all')
        .reply(200, { message: { dachshund: [] }, status: 'success' });

console.log = jest.fn();

let app: Application;
let cleanup: () => void;

describe('GET /dogs', () => {
    beforeAll(async () => {
        ({ app, cleanup } = await createApp());
    });

    afterAll(async () => {
        cleanup();
    });

    beforeEach(async () => {
        await redisClient.flushAll();
        inMemoryCache.flushAll();
    });

    afterEach(() => {
        checkNockIsDone();
    });

    it('should return dog list', async () => {
        expect.assertions(2);

        mockDogApi();

        const { status, body } = await request(app).get('/dogs');

        expect(status).toEqual(200);
        expect(body).toMatchSnapshot();
    });

    it('should cache api response', async () => {
        mockDogApi();

        await request(app).get('/dogs').expect(200);

        await request(app).get('/dogs').expect(200);

        await expect(redisClient.get('DOGS')).resolves.toMatchSnapshot();
        await expect(redisClient.ttl('DOGS')).resolves.toEqual(10);
        await expect(inMemoryCache.get('DOGS')).toMatchSnapshot();
    });
});
