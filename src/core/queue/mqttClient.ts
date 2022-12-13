import mqtt from 'async-mqtt';

const host = 'localhost';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

// const topic = '/nodejs/mqtt';

export class MqttClient {
    private client: mqtt.AsyncMqttClient | null = null;

    public async connect(): Promise<void> {
        this.client = await mqtt
            .connectAsync(connectUrl, { clientId })
            .catch((e) => {
                console.log(e);
                return null;
            });
        console.log('mqtt client connected');
    }

    public async subscribe(topic: string, messageHandler: MessageHandler) {
        this.client
            ?.subscribe([topic])
            .then(() => console.log(`subscribed to ${topic}`));

        this.client?.on('message', (msgTopic, payload) => {
            if (msgTopic === topic) {
                messageHandler(payload);
            }
        });
    }

    public async publish(topic: string, message: string) {
        await this.client?.publish(topic, message);
    }
}

export const mqttClient = new MqttClient();

type MessageHandler = (payload: any) => void;
