import { Logger } from "winston";
import { Connection, Channel } from "amqplib";
import { rabbitChannel } from "../data/rabbitMQ";

export class MonitoringService { 
    
    logger: Logger;
    processInstanceId: string;
    connection: Connection;
    ch: Channel;
    queueName: string;

    constructor(logger: Logger, processInstanceId, rmqConnection, queueName) {
        this.processInstanceId = processInstanceId;
        this.logger = logger;
        this.connection = rmqConnection;
        this.queueName = queueName;
    }

    async connect(): Promise<void> {
        try {
            //this.connection = await rabbitConnection();
            this.ch = await rabbitChannel(this.connection);
            console.log('VerificationEmailProducer connected to RabbitMQ Channel');
        } catch(err) {
            //report
            console.log('VerificationEmailProducer could not connect to RabbitMQ Channel');
            return null;
        }
        //this.connection.on('close', this.connect.bind(this));
    }

    log(msg) {
        this.report(`${this.processInstanceId}: ${msg}`);
        this.logger.info(`${this.processInstanceId}: ${msg}`);
        //this.logger.error('test');
    }

    async report(msg) {
        if(!this.ch) await this.connect();

        const msgBuffer = new Buffer(JSON.stringify(msg));

        try {
            return this.ch.sendToQueue(this.queueName, msgBuffer);
        } catch(err) {
            //report err
            console.log(err);
        }
    }
}