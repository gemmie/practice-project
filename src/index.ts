import express from 'express';
import { redisClient } from 'core/cache/redisClient';
import { getAllBreeds } from 'core/dogApi/dogApiClient';
import { getDataFromCache } from 'core/cache/cacheClient';

const app = express();
const port = process.env.port || 5000;

app.get('/', (req, res) => {
    res.send('Hello XD World! XXX');
});

app.get('/dogs', getDataFromCache, async (req, res) => {
    const breeds = await getAllBreeds(req.url);

    res.send(breeds);
});

redisClient.connect().then(() => {
    app.listen(port, () => console.log(`listening on port ${port}`));
});
