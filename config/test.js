const config = {
    // sqs: {
    //     queueUrl: 'http://queue-1.xd',
    //     accessKeyId: 'test-key-id',
    //     secretAccessKey: 'secret-key',
    // },
    sqs: {
        queueUrl: process.env.QUEUE_URL || '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        region: 'eu-central-1',
        delayNextMessageReadSeconds: 5,
    },
};

module.exports = config;
