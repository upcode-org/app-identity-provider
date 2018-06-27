                                                         
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
//Message Broker dependecies 
import { VerificationEmailProducer } from './services/verification-email-produer';
//*******************************************************************/

//*******************************************************************/
//Monitoring dependecies
import { MonitoringService } from './services/monitoring-service';
import { ArchivingService } from './services/archiving-service';
//*******************************************************************/

//*******************************************************************/
//Application
import { IdentityProvider } from './services/identity-provider';
//*******************************************************************/


export const containerResolver = async (): Promise<AppContainer> => {
    try {
        const identityProviderDb = await mongoConnection();
        
        container.register('identityProviderDb', identityProviderDb );
        container.singleton('verificationEmailProducer', VerificationEmailProducer);
        container.singleton('userRepository', UserRepository, ['identityProviderDb'] );
        container.singleton('identityProvider', IdentityProvider, ['userRepository', 'archivingService', 'verificationEmailProducer'] );
        container.singleton('monitoringService', MonitoringService);
        container.singleton('archivingService', ArchivingService , ['identityProviderDb']);

        const verificationEmailProducer: VerificationEmailProducer = container.get('verificationEmailProducer');
        await verificationEmailProducer.connect();

        return container;

    } catch(err) {
        throw err
    }
}
