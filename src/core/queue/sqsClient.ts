import {
    SQSClient,
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import config from 'config';
import { InvalidateCacheMessage, QMessageHandler } from './types';

const sqsConfig = config.get('sqs') as {
    queueUrl: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    delayNextMessageReadSeconds: number;
};

const client = new SQSClient({
    credentials: {
        accessKeyId: sqsConfig.accessKeyId,
        secretAccessKey: sqsConfig.secretAccessKey,
    },
    region: sqsConfig.region,
});

export const sendMsg = async (message: InvalidateCacheMessage) => {
    const sendMessageCommand = new SendMessageCommand({
        QueueUrl: sqsConfig.queueUrl,
        MessageBody: JSON.stringify(message),
    });
    const response = await client.send(sendMessageCommand);
    console.log('SENT \n', response);
};

const consumeMsg = async ({ handleMessage }: QMessageHandler) => {
    const receiveMessageCommand = new ReceiveMessageCommand({
        QueueUrl: sqsConfig.queueUrl,
        MaxNumberOfMessages: 10,
    });

    const response = await client.send(receiveMessageCommand);

    if (response.Messages) {
        await Promise.all(
            response.Messages.map(async (message) => {
                await deleteMsg(message.ReceiptHandle);

                if (message.Body) {
                    const msg = JSON.parse(message.Body);
                    await handleMessage(msg);
                    console.log('RECEIVED \n', msg.cacheKey);
                }
            })
        );
    }
    return response.Messages?.length;
};

export const receiveMsg = ({
    handleMessage,
}: QMessageHandler): (() => void) => {
    consumeMsg({ handleMessage });
    const intervalId = setInterval(
        () => consumeMsg({ handleMessage }),
        sqsConfig.delayNextMessageReadSeconds * 1000
    );

    return () => clearInterval(intervalId);
};

const deleteMsg = async (receiptHandle: any) => {
    const deleteInput = {
        QueueUrl: sqsConfig.queueUrl,
        ReceiptHandle: receiptHandle,
    };

    const data = await client.send(new DeleteMessageCommand(deleteInput));

    console.log('DELETED \n', data);
};
