import {
    SQSClient,
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import * as dotenv from 'dotenv';
import { InvalidateCacheMessage, QMessageHandler } from 'core/queue/types';
dotenv.config();

const QUEUE_URL = process.env.QUEUE_URL || '';

const client = new SQSClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    region: 'eu-central-1',
});

export const sendMsg = async (message: InvalidateCacheMessage) => {
    const sendMessageCommand = new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(message),
    });
    const response = await client.send(sendMessageCommand);
    console.log('SENT \n', response);
};

export const receiveMsg = async ({ handleMessage }: QMessageHandler) => {
    const receiveMessageCommand = new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10,
    });

    const response = await client.send(receiveMessageCommand);

    if (response.Messages) {
        await Promise.all(
            response.Messages.map(async (message) => {
                if (message.Body) {
                    const msg = JSON.parse(message.Body);
                    await handleMessage(msg);
                    console.log('RECEIVED \n', msg.cacheKey);
                }

                await deleteMsg(message.ReceiptHandle);
            })
        );

        receiveMsg({ handleMessage });
    } else {
        setTimeout(() => receiveMsg({ handleMessage }), 30 * 1000);
    }
};

const deleteMsg = async (receiptHandle: any) => {
    const deleteInput = {
        QueueUrl: QUEUE_URL,
        ReceiptHandle: receiptHandle,
    };

    const data = await client.send(new DeleteMessageCommand(deleteInput));

    console.log('DELETED \n', data);
};
