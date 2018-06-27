import { EventEmitter } from "events";
import { Connection, Channel } from 'amqplib';
import { Db } from "mongodb";
import { rabbitConnection, rabbitChannel } from '../data/rabbitMQ';

export class ConnectionMonitor extends EventEmitter {
    
    constructor(private identityProviderDb: Db, private rmqConnection: Connection, private rmqChannel: Channel){
        super();

        this.rmqConnection.on('close', this.handleRmqError ); 
        this.rmqChannel.on('close', this.handleRmqError ); 
    }

    startMonitoring(){

    }

    private async handleRmqError(err?): Promise<void> {
        try {
            const rmqConnection = await rabbitConnection();
            const rmqChannel = await rabbitChannel(rmqConnection);
        } catch(err) {

        }
    }

}