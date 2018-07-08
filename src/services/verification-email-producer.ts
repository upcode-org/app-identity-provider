import { Channel, Connection } from 'amqplib';
import { rabbitChannel } from "../connections/rabbitMQ";

export class VerificationEmailProducer {
    
    queueName = 'app-signup-verification-emails'; //dev vs prod ENV
    ch: Channel;
    connection: Connection;

    constructor(rmqConnection) {
        this.connection = rmqConnection;
    }

    async connect(): Promise<void> {
        try {
            this.ch = await rabbitChannel(this.connection);
            //console.log('VerificationEmailProducer connected to RabbitMQ Channel');
        } catch(err) {
            console.log('VerificationEmailProducer could not connect to RabbitMQ Channel');
            return null;
        }
    }

    async produceMsg(msg): Promise<boolean> {
        if(!this.ch) await this.connect();

        const msgBuffer = new Buffer(JSON.stringify(msg));

        try {
            return this.ch.sendToQueue(this.queueName, msgBuffer, {expiration:60000*30});
        } catch(err) {
            //report err
            console.log(err);
        }
    }
}