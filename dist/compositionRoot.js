"use strict";
//   _______  _______   _______  __   __  _______  ___      _______ 
//  |       ||       | |       ||  | |  ||       ||   |    |       |
//  |    ___||   _   | |       ||  |_|  ||       ||   |    |    ___|
//  |   | __ |  | |  | |       ||       ||       ||   |    |   |___ 
//  |   ||  ||  |_|  | |      _||_     _||      _||   |___ |    ___|
//  |   |_| ||       | |     |_   |   |  |     |_ |       ||   |___ 
//  |_______||_______| |_______|  |___|  |_______||_______||_______|
Object.defineProperty(exports, "__esModule", { value: true });
//  _      _               _    _  _                                       _      _             
// (_)    | |             | |  (_)| |                                     (_)    | |            
//  _   __| |  ___  _ __  | |_  _ | |_  _   _   _ __   _ __   ___  __   __ _   __| |  ___  _ __ 
// | | / _` | / _ \| '_ \ | __|| || __|| | | | | '_ \ | '__| / _ \ \ \ / /| | / _` | / _ \| '__|
// | || (_| ||  __/| | | || |_ | || |_ | |_| | | |_) || |   | (_) | \ V / | || (_| ||  __/| |   
// |_| \__,_| \___||_| |_| \__||_| \__| \__, | | .__/ |_|    \___/   \_/  |_| \__,_| \___||_|   
//                                       __/ | | |                                              
//                                      |___/  |_|                                              
const awilix = require("awilix");
exports.container = awilix.createContainer();
//*******************************************************************/
//Database dependecy - "Learn all you can from the mistakes of others. You won't have time to make them all yourself." ~Alfred Sheinwold
const database_1 = require("./data/database");
//*******************************************************************/
//*******************************************************************/
//Monitoring dependecy - "Learn all you can from the mistakes of others. You won't have time to make them all yourself." ~Alfred Sheinwold
const monitoring_service_1 = require("./services/monitoring-service");
//*******************************************************************/
//*******************************************************************/
//Application Dependencies - "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart." ~Hellen Keller
const identity_provider_1 = require("./services/identity-provider");
const archiving_service_1 = require("./services/archiving-service");
//*******************************************************************/
exports.container.register({
    //Register singletons:
    MongoDriver: awilix.asClass(database_1.MongoDriver).singleton(),
    IdentityProvider: awilix.asClass(identity_provider_1.IdentityProvider).singleton(),
    ArchivingService: awilix.asClass(archiving_service_1.ArchivingService).singleton(),
    MonitoringService: awilix.asClass(monitoring_service_1.MonitoringService).singleton()
});
exports.container.resolve('MongoDriver');
exports.container.resolve('IdentityProvider');
exports.container.resolve('ArchivingService');
exports.container.resolve('MonitoringService');
//# sourceMappingURL=compositionRoot.js.map