import { createQueueWorker } from './queueWorker';

const { start } = createQueueWorker();

start();
