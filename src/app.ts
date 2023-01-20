import express from 'express';
import { BreedsResponse, getAllBreeds } from './core/dogApi/dogApiClient';
import { withCombinedCache } from './core/cache/withCombinedCache';
import { sendInvalidateCacheMsg } from './core/queue/cacheQueueHandler';
import { mqttClient } from './core/queue/mqttClient';
import bodyParser from 'body-parser';
import path from 'path';
import { redisClient } from './core/cache/redisClient';

export const createApp = async () => {
    const app = express();

    const cacheKey = 'DOGS';

    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'index.html'));
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

        mqttClient.publish(topic, message);

        res.sendStatus(200);
    });

    app.post('/dogs', async (req, res) => {
        await sendInvalidateCacheMsg(cacheKey);

        res.sendStatus(200);
    });

    Promise.all([redisClient.connect(), mqttClient.connect()]).then(() => {
        mqttClient.subscribe('topic1', (payload) =>
            console.log(payload.toString())
        );
    });

    return {
        app,
        cleanup: async () => {
            await redisClient.disconnect();
            await mqttClient.disconnect();
        },
    };
};
