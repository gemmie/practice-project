import { Message } from '@aws-sdk/client-sqs';

export type QueueMessage = InvalidateCacheMessage;

export interface InvalidateCacheMessage {
    cacheKey: string;
}

export interface QMessageHandler {
    handleMessage: (message: InvalidateCacheMessage) => void;
}
