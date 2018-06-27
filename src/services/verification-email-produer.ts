import { Channel, Connection } from 'amqplib';
import { rabbitConnection, rabbitChannel } from "../data/rabbitMQ";

export class VerificationEmailProducer {
    
    queueName = 'verification-emails'; //dev vs prod ENV
    ch: Channel;
    connection: Connection;

    async connect(): Promise<void> {
        try {
            this.connection = await rabbitConnection();
            this.ch = await rabbitChannel(this.connection);
            console.log('connected to RabbitMQ');
        } catch(err) {
            //report
            console.log('could not connect to RabbitMQ');
            return null
        }
        this.connection.on('close', this.connect.bind(this));
    }

    produceMsg(msg): boolean {
        const msgBuffer = new Buffer(JSON.stringify(msg));

        try {
            return this.ch.sendToQueue(this.queueName, msgBuffer, {expiration:60000*30});
        } catch(err) {
            //report err
            console.log(err);
        }
    }

    setNewCh(newCh: Channel): void {
        this.ch = newCh;
    }

}