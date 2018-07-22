import { Channel } from 'amqplib';

export class VerificationEmailProducer {
    
    queueName = 'emails-to-send'; //dev vs prod ENV
    ch: Channel;

    constructor(ch) {
        this.ch = ch;
    }

    async produceMsg(msg): Promise<boolean> {

        const msgBuffer = new Buffer(JSON.stringify(msg));

        try {
            return this.ch.sendToQueue(this.queueName, msgBuffer, {expiration:60000*30});
        } catch(err) {
            //report err 
            console.log(err); //avoid infinite loop - throw custom error
        }
    }
}