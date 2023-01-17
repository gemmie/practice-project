import { createQueueWorker } from 'src/queueWorker';
import nock from 'nock';

const { start, cleanup } = createQueueWorker();

nock.recorder.rec();

describe('test queue worker', () => {
    beforeAll(async () => {
        await start();
    });

    afterAll(async () => {
        await cleanup();
    });

    it('should handle sqs message', async () => {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 1500);
        });
    });
});
