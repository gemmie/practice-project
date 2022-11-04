import express from 'express';


const app = express();
const port = process.env.port || 5000;

app.get('/', (req, res) => {
    res.send('Hello XD World! XXX');
});


app.listen(port, () => console.log(`listening on port ${port}`))