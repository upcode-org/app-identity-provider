                                                         
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
//Monitoring dependecy 
import { MonitoringService } from './services/monitoring-service';
//*******************************************************************/

//*******************************************************************/
//Application Dependencies 
import { IdentityProvider } from './services/identity-provider';
import { ArchivingService } from './services/archiving-service';
//*******************************************************************/


export const containerResolver = async (): Promise<AppContainer> => {
    try {
        const identityProviderDb = await mongoConnection();
        container.singleton('identityProviderDb', identityProviderDb );
        container.singleton('userRepository', UserRepository, ['identityProviderDb'] );
        container.singleton('identityProvider', IdentityProvider, ['userRepository'] );
        container.singleton('monitoringService', MonitoringService);
        container.singleton('archivingService', ArchivingService);
        return container;

    } catch(err) {
        throw err
    }
}
