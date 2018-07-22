import { Logger } from "winston";
import { Channel } from "amqplib";

export class MonitoringService { 
    
    logger: Logger;
    processInstanceId: string;
    ch: Channel;
    queueName: string;

    constructor(logger: Logger, processInstanceId: string, monServCh: Channel, queueName: string) {
        this.logger = logger;
        this.processInstanceId = processInstanceId;
        this.ch = monServCh;
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
            console.log(err) //avoid infinite loop!
            //throw custom err
        }
    }
}