import express from 'express';
import * as dotenv from 'dotenv';
import { redisClient } from 'core/cache/redisClient';
import { BreedsResponse, getAllBreeds } from 'core/dogApi/dogApiClient';
import { withCombinedCache } from 'core/cache/withCombinedCache';
import { sendInvalidateCacheMsg } from 'core/queue/cacheQueueHandler';
import { mqttClient } from 'core/queue/mqttClient';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.port || 5000;

const cacheKey = 'DOGS';

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dogs', async (req, res) => {
    const breeds = await withCombinedCache<BreedsResponse>(
        cacheKey,
        getAllBreeds,
        10
    );

    res.send(breeds);
});

app.post('/mqtt', (req, res) => {
    const { topic, message } = req.body;

    console.log(topic, message);

    mqttClient.publish(topic, message);

    res.sendStatus(200);
});

app.post('/dogs', async (req, res) => {
    await sendInvalidateCacheMsg(cacheKey);

    res.sendStatus(200);
});

Promise.all([redisClient.connect(), mqttClient.connect()]).then(() => {
    app.listen(port, () => console.log(`listening on port ${port}`));
    mqttClient.subscribe('topic1', (payload) =>
        console.log(payload.toString())
    );
});
