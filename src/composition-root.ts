                                                         
//  _      _               _    _  _                                       _      _             
// (_)    | |             | |  (_)| |                                     (_)    | |            
//  _   __| |  ___  _ __  | |_  _ | |_  _   _   _ __   _ __   ___  __   __ _   __| |  ___  _ __ 
// | | / _` | / _ \| '_ \ | __|| || __|| | | | | '_ \ | '__| / _ \ \ \ / /| | / _` | / _ \| '__|
// | || (_| ||  __/| | | || |_ | || |_ | |_| | | |_) || |   | (_) | \ V / | || (_| ||  __/| |   
// |_| \__,_| \___||_| |_| \__||_| \__| \__, | | .__/ |_|    \___/   \_/  |_| \__,_| \___||_|   
//                                       __/ | | |                                              
//                                      |___/  |_|                                              

import { AppContainer } from './lib/container';
export const container = new AppContainer();

//*******************************************************************/
//Connection dependecies 
import { mongoConnection } from './connections/database';
import { rabbitConnection, rabbitChannel } from './connections/rabbitMQ';
//*******************************************************************/

//*******************************************************************/
//Monitoring dependecies
import { MonitoringService } from './services/monitoring-service';
import { logger } from './services/logger';
//*******************************************************************/

//*******************************************************************/
//Application
import { IdentityProvider } from './services/identity-provider/identity-provider';
import { VerificationEmailProducer } from './services/verification-email-producer';
//*******************************************************************/

//*******************************************************************/
//Domain
import { UserRepository } from './repositories/user-repository';
//*******************************************************************/


export const containerResolver = async (): Promise<AppContainer> => {
    try {
        const identityProviderDb = await mongoConnection();
        const rmqConnection = await rabbitConnection();
        const verifEmailProdCh = await rabbitChannel(rmqConnection);
        const monServCh = await rabbitChannel(rmqConnection);
        
        container.singleton('verifEmailProdCh', verifEmailProdCh);
        container.singleton('monServCh', monServCh);
        
        container.singleton('verificationEmailProducer', VerificationEmailProducer, ['verifEmailProdCh'] );
        container.singleton('identityProviderDb', identityProviderDb );
        container.singleton('logger', logger);
        container.singleton('userRepository', UserRepository, ['identityProviderDb'] );
        
        // Will be registered on each req. These will only be available in the container where they were registered
        container.scopedDependency('processInstanceId', process.pid );
        container.scopedDependency('queueName', 'app-identity-provider-logs' );
        
        // Will be instantiated in each req. One or more of the dependencies will be a scoped dependency.
        container.scopedSingleton('monitoringService', MonitoringService, ['logger', 'processInstanceId', 'monServCh', 'queueName']);
        container.scopedSingleton('identityProvider', IdentityProvider, ['userRepository', 'verificationEmailProducer', 'monitoringService'] );

        return container;

    } catch(err) {
        throw err
    }
}
