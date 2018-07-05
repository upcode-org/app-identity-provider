                                                         
//  _      _               _    _  _                                       _      _             
// (_)    | |             | |  (_)| |                                     (_)    | |            
//  _   __| |  ___  _ __  | |_  _ | |_  _   _   _ __   _ __   ___  __   __ _   __| |  ___  _ __ 
// | | / _` | / _ \| '_ \ | __|| || __|| | | | | '_ \ | '__| / _ \ \ \ / /| | / _` | / _ \| '__|
// | || (_| ||  __/| | | || |_ | || |_ | |_| | | |_) || |   | (_) | \ V / | || (_| ||  __/| |   
// |_| \__,_| \___||_| |_| \__||_| \__| \__, | | .__/ |_|    \___/   \_/  |_| \__,_| \___||_|   
//                                       __/ | | |                                              
//                                      |___/  |_|                                              

import { AppContainer } from '../lib/container';
export const container = new AppContainer();

//*******************************************************************/
//Data dependecies 
import { mongoConnection } from './data/database';
import { UserRepository } from './repositories/user-repository';
//*******************************************************************/

//*******************************************************************/
//Monitoring dependecies
import { MonitoringService } from './services/monitoring-service';
import { logger } from './services/logger';
//*******************************************************************/

//*******************************************************************/
//Application
import { IdentityProvider } from './services/identity-provider';
import { VerificationEmailProducer } from './services/verification-email-producer';
import { rabbitConnection } from './data/rabbitMQ';
//*******************************************************************/


export const containerResolver = async (): Promise<AppContainer> => {
    try {
        const identityProviderDb = await mongoConnection();
        const rmqConnection = await rabbitConnection();
        
        container.singleton('rmqConnection', rmqConnection);
        container.singleton('verificationEmailProducer', VerificationEmailProducer, ['rmqConnection'] );
        container.singleton('identityProviderDb', identityProviderDb );
        container.singleton('userRepository', UserRepository, ['identityProviderDb'] );
        container.singleton('logger', logger);
        
        container.scoped('processInstanceId', process.pid );
        container.scoped('queueName', 'identity-provider-logs' );
        container.scoped('monitoringService', MonitoringService, ['logger', 'processInstanceId', 'rmqConnection', 'queueName']);
        container.scoped('identityProvider', IdentityProvider, ['userRepository', 'verificationEmailProducer', 'monitoringService'] );

        return container;

    } catch(err) {
        throw err
    }
}
