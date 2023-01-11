require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    sqs: {
        queueUrl: process.env.QUEUE_URL || '',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        region: 'eu-central-1',
    },
};

module.exports = config;
