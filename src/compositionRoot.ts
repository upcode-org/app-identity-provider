 
//   _______  _______   _______  __   __  _______  ___      _______ 
//  |       ||       | |       ||  | |  ||       ||   |    |       |
//  |    ___||   _   | |       ||  |_|  ||       ||   |    |    ___|
//  |   | __ |  | |  | |       ||       ||       ||   |    |   |___ 
//  |   ||  ||  |_|  | |      _||_     _||      _||   |___ |    ___|
//  |   |_| ||       | |     |_   |   |  |     |_ |       ||   |___ 
//  |_______||_______| |_______|  |___|  |_______||_______||_______|
                                                          
//  _      _               _    _  _                                       _      _             
// (_)    | |             | |  (_)| |                                     (_)    | |            
//  _   __| |  ___  _ __  | |_  _ | |_  _   _   _ __   _ __   ___  __   __ _   __| |  ___  _ __ 
// | | / _` | / _ \| '_ \ | __|| || __|| | | | | '_ \ | '__| / _ \ \ \ / /| | / _` | / _ \| '__|
// | || (_| ||  __/| | | || |_ | || |_ | |_| | | |_) || |   | (_) | \ V / | || (_| ||  __/| |   
// |_| \__,_| \___||_| |_| \__||_| \__| \__, | | .__/ |_|    \___/   \_/  |_| \__,_| \___||_|   
//                                       __/ | | |                                              
//                                      |___/  |_|                                              

import * as awilix from 'awilix';
export const container = awilix.createContainer();

export const environment = 'dev'; //change3
//*******************************************************************/
//Database dependecy - "Learn all you can from the mistakes of others. You won't have time to make them all yourself." ~Alfred Sheinwold
import { MongoDriver } from './data/database';
//*******************************************************************/

//*******************************************************************/
//Monitoring dependecy - "Learn all you can from the mistakes of others. You won't have time to make them all yourself." ~Alfred Sheinwold
import { MonitoringService } from './services/monitoring-service';
//*******************************************************************/

//*******************************************************************/
//Application Dependencies - "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart." ~Hellen Keller
import { IdentityProvider } from './services/identity-provider';
import { ArchivingService } from './services/archiving-service';
//*******************************************************************/

container.register({
    //Register singletons:
    MongoDriver: awilix.asClass(MongoDriver).singleton(),
    IdentityProvider: awilix.asClass(IdentityProvider).singleton(),
    ArchivingService: awilix.asClass(ArchivingService).singleton(),
    MonitoringService: awilix.asClass(MonitoringService).singleton()
});

container.resolve('MongoDriver');
container.resolve('IdentityProvider');
container.resolve('ArchivingService');
container.resolve('MonitoringService');
 