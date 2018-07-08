import { Logger } from "winston";
import { Connection, Channel } from "amqplib";

export class MonitoringService { 
    
    logger: Logger;
    processInstanceId: string;
    connection: Connection;
    ch: Channel;
    queueName: string;

    constructor(logger: Logger, processInstanceId, rmqConnection, rmqChannel, queueName) {
        this.processInstanceId = processInstanceId;
        this.logger = logger;
        this.connection = rmqConnection;
        this.ch = rmqChannel;
        this.queueName = queueName;
    }

    log(msg) {
        if(!process.env.TEST) {
            this.report(`${this.processInstanceId}: ${msg}`);
            this.logger.info(`${this.processInstanceId}: ${msg} \n`);
        }
    }

    async report(msg): Promise<boolean> {

        const msgBuffer = new Buffer(JSON.stringify(msg));

        try {
            return this.ch.sendToQueue(this.queueName, msgBuffer);
        } catch(err) {
            //report err
            this.log(err && err.message ? err.message : 'Error sending to Rabbit Queue');
        }
    }
}