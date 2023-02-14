import { createQueueWorker } from 'src/queueWorker';
import nock from 'nock';
import { checkNockIsDone } from 'test/integration/util/nock';
import { redisClient } from './util/redis';
import pWaitFor from 'p-wait-for';

const { start, cleanup } = createQueueWorker();

// nock.recorder.rec();

const mockSQSMessage = () =>
    nock('https://sqs.eu-central-1.amazonaws.com:443', {
        encodedQueryParams: true,
    })
        .post(
            '/',
            'QueueUrl=https%3A%2F%2Fsqs.eu-central-1.amazonaws.com%2F853945978474%2Ftech-jump-q&MaxNumberOfMessages=10&Action=ReceiveMessage&Version=2012-11-05'
        )
        .reply(
            200,
            '<?xml version="1.0"?><ReceiveMessageResponse xmlns="http://queue.amazonaws.com/doc/2012-11-05/"><ReceiveMessageResult><Message><MessageId>2ec99142-ce32-4055-9d10-da7f5b87b3ee</MessageId><ReceiptHandle>AQEBWHrrTwnkGBKWqtkcV+Iu/dxSwL+zZieb05a6IpiwGM37ngd7meVoelcUAR3ZrMfuM5kYjG3mzOgU5JBEY3/6xmCeH3zgkxCdvjQak0N2Bx0csyyv2/4KGOzCrr0dKFRFu4KmBB6veGW+nQuIhVSmUqm6nwXgCrmqr/5sVC+xAzOgP15NQvaUOQ5BMm0Bp5ObKK6Dw9zPLctDjIujLudQ9b3VnzfvFgBjdZv0oXVNCMCVlXE4viUNrQlCHCoVffDSlwl2YX0EVkozqt6BlLcC12AqJvkctViZath5eHxC/VxHDrCXZ+Vjc+p5jXIhyQarXTQcWmcwJlQLZcxpYGRSHWfUmq83Jth9VDBYjb3udkLbkjrVCzsfSkO1a7ywHrtR4Wml4Kcerjr37MmVBDdDxw==</ReceiptHandle><MD5OfBody>d3de5782303e88d9a6daa69122f83c08</MD5OfBody><Body>{&quot;cacheKey&quot;:&quot;DOGS&quot;}</Body></Message></ReceiveMessageResult><ResponseMetadata><RequestId>4906f807-b4d2-5eb0-bbcc-a44335c32f58</RequestId></ResponseMetadata></ReceiveMessageResponse>',
            [
                'x-amzn-RequestId',
                '4906f807-b4d2-5eb0-bbcc-a44335c32f58',
                'Date',
                'Fri, 20 Jan 2023 11:45:21 GMT',
                'Content-Type',
                'text/xml',
                'Content-Length',
                '890',
            ]
        );

const mockSQSResponse = () =>
    nock('https://sqs.eu-central-1.amazonaws.com:443', {
        encodedQueryParams: true,
    })
        .post(
            '/',
            'QueueUrl=https%3A%2F%2Fsqs.eu-central-1.amazonaws.com%2F853945978474%2Ftech-jump-q&ReceiptHandle=AQEBWHrrTwnkGBKWqtkcV%2BIu%2FdxSwL%2BzZieb05a6IpiwGM37ngd7meVoelcUAR3ZrMfuM5kYjG3mzOgU5JBEY3%2F6xmCeH3zgkxCdvjQak0N2Bx0csyyv2%2F4KGOzCrr0dKFRFu4KmBB6veGW%2BnQuIhVSmUqm6nwXgCrmqr%2F5sVC%2BxAzOgP15NQvaUOQ5BMm0Bp5ObKK6Dw9zPLctDjIujLudQ9b3VnzfvFgBjdZv0oXVNCMCVlXE4viUNrQlCHCoVffDSlwl2YX0EVkozqt6BlLcC12AqJvkctViZath5eHxC%2FVxHDrCXZ%2BVjc%2Bp5jXIhyQarXTQcWmcwJlQLZcxpYGRSHWfUmq83Jth9VDBYjb3udkLbkjrVCzsfSkO1a7ywHrtR4Wml4Kcerjr37MmVBDdDxw%3D%3D&Action=DeleteMessage&Version=2012-11-05'
        )
        .reply(
            200,
            '<?xml version="1.0"?><DeleteMessageResponse xmlns="http://queue.amazonaws.com/doc/2012-11-05/"><ResponseMetadata><RequestId>83c40031-196c-5796-a850-5c75987de67e</RequestId></ResponseMetadata></DeleteMessageResponse>',
            [
                'x-amzn-RequestId',
                '83c40031-196c-5796-a850-5c75987de67e',
                'Date',
                'Fri, 20 Jan 2023 11:45:21 GMT',
                'Content-Type',
                'text/xml',
                'Content-Length',
                '215',
            ]
        );

const cacheKey = 'DOGS';
describe('test queue worker', () => {
    afterEach(async () => {
        await cleanup();
        checkNockIsDone();
    });

    it('should handle sqs message', async () => {
        await redisClient.connect();
        await redisClient.set(cacheKey, 'value', {
            EX: 10,
        });

        console.log(await redisClient.get(cacheKey));

        mockSQSMessage();

        mockSQSResponse();

        await start();

        await pWaitFor(
            async () => {
                const cachedValue = await redisClient.get(cacheKey);

                console.log('- - -', cachedValue);

                return !cachedValue;
                // await new Promise((resolve) => setTimeout(resolve, 1500));
                //
                // return true;
            },
            {
                timeout: 3000,
            }
        );

        await redisClient.disconnect();

        // expect(cachedValue).toBeUndefined();
    }, 5000);
});
