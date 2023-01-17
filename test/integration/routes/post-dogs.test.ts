import request from 'supertest';
import { createApp } from 'src/app';
import nock from 'nock';
import { checkNockIsDone } from '../util/nock';
import { Application } from 'express';
import { redisClient } from 'src/core/cache/redisClient';
import { inMemoryCache } from 'src/core/cache/inMemoryCacheClient';

console.log = jest.fn();

const mockSQS = () =>
    nock('https://sqs.eu-central-1.amazonaws.com:443', {
        encodedQueryParams: true,
    })
        .post(
            '/',
            'QueueUrl=http%3A%2F%2Fqueue-1.xd&MessageBody=%7B%22cacheKey%22%3A%22DOGS%22%7D&Action=SendMessage&Version=2012-11-05'
        )
        .reply(
            200,
            '<?xml version="1.0"?><SendMessageResponse xmlns="http://queue.amazonaws.com/doc/2012-11-05/"><SendMessageResult><MessageId>9f59f0c6-e5a7-4414-8f11-0e33913c6080</MessageId><MD5OfMessageBody>d3de5782303e88d9a6daa69122f83c08</MD5OfMessageBody></SendMessageResult><ResponseMetadata><RequestId>082d3d49-a1e9-5dca-9487-6157fc14d196</RequestId></ResponseMetadata></SendMessageResponse>'
        );

let app: Application;
let cleanup: () => void;

// nock.recorder.rec();
describe('POST /dogs', () => {
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

    it('should send invalidate cache message', async () => {
        mockSQS();
        await request(app).post('/dogs');
    });
});
