import express from 'express';
import { redisClient } from 'core/cache/redisClient';
import { getAllBreeds } from 'core/dogApi/dogApiClient';
import { withCache } from 'core/cache/withCache';

const app = express();
const port = process.env.port || 5000;

app.get('/', (req, res) => {
    res.send('Hello XD World! XXX');
});

app.get('/dogs', async (req, res) => {
    const breeds = await withCache(req.url, getAllBreeds, 5);

    res.send(breeds);
});

redisClient.connect().then(() => {
    app.listen(port, () => console.log(`listening on port ${port}`));
});
