import express from 'express';
import * as dotenv from 'dotenv';
import { redisClient } from 'core/cache/redisClient';
import { BreedsResponse, getAllBreeds } from 'core/dogApi/dogApiClient';
import { withCombinedCache } from 'core/cache/withCombinedCache';
import { sendInvalidateCacheMsg } from 'core/queue/cacheQueueHandler';

dotenv.config();

const app = express();
const port = process.env.port || 5000;

const cacheKey = 'DOGS';

app.get('/', (req, res) => {
    res.send('Hello XD World! XXX');
});

app.get('/dogs', async (req, res) => {
    const breeds = await withCombinedCache<BreedsResponse>(
        cacheKey,
        getAllBreeds,
        10
    );

    res.send(breeds);
});

app.post('/dogs', async (req, res) => {
    await sendInvalidateCacheMsg(cacheKey);

    res.sendStatus(200);
});

redisClient.connect().then(() => {
    app.listen(port, () => console.log(`listening on port ${port}`));
});
