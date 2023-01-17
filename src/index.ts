import { createApp } from 'src/app';
import config from 'config';

const port = config.get('port');

createApp().then(({ app }) =>
    app.listen(port, () => console.log(`listening on port ${port}`))
);
