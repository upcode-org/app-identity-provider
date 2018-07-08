"use strict";
//  _      _               _    _  _                                       _      _             
// (_)    | |             | |  (_)| |                                     (_)    | |            
//  _   __| |  ___  _ __  | |_  _ | |_  _   _   _ __   _ __   ___  __   __ _   __| |  ___  _ __ 
// | | / _` | / _ \| '_ \ | __|| || __|| | | | | '_ \ | '__| / _ \ \ \ / /| | / _` | / _ \| '__|
// | || (_| ||  __/| | | || |_ | || |_ | |_| | | |_) || |   | (_) | \ V / | || (_| ||  __/| |   
// |_| \__,_| \___||_| |_| \__||_| \__| \__, | | .__/ |_|    \___/   \_/  |_| \__,_| \___||_|   
//                                       __/ | | |                                              
//                                      |___/  |_|                                              
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("./lib/container");
exports.container = new container_1.AppContainer();
//*******************************************************************/
//Connection dependecies 
const database_1 = require("./connections/database");
const rabbitMQ_1 = require("./connections/rabbitMQ");
//*******************************************************************/
//*******************************************************************/
//Monitoring dependecies
const monitoring_service_1 = require("./services/monitoring-service");
const logger_1 = require("./services/logger");
//*******************************************************************/
//*******************************************************************/
//Application
const identity_provider_1 = require("./services/identity-provider/identity-provider");
const verification_email_producer_1 = require("./services/verification-email-producer");
//*******************************************************************/
//*******************************************************************/
//Domain
const user_repository_1 = require("./repositories/user-repository");
//*******************************************************************/
exports.containerResolver = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const identityProviderDb = yield database_1.mongoConnection();
        const rmqConnection = yield rabbitMQ_1.rabbitConnection();
        const rmqChannel = yield rabbitMQ_1.rabbitChannel(rmqConnection);
        exports.container.singleton('rmqConnection', rmqConnection);
        exports.container.singleton('rmqChannel', rmqChannel);
        exports.container.singleton('verificationEmailProducer', verification_email_producer_1.VerificationEmailProducer, ['rmqConnection']);
        exports.container.singleton('identityProviderDb', identityProviderDb);
        exports.container.singleton('userRepository', user_repository_1.UserRepository, ['identityProviderDb']);
        exports.container.singleton('logger', logger_1.logger);
        // Will be registered on each req. These will only be available in the container where they were registered
        exports.container.scopedDependency('processInstanceId', process.pid);
        exports.container.scopedDependency('queueName', 'app-identity-provider-logs');
        // Will be instantiated in each req. One or more of the dependencies will be a scoped dependency.
        exports.container.scopedSingleton('monitoringService', monitoring_service_1.MonitoringService, ['logger', 'processInstanceId', 'rmqConnection', 'rmqChannel', 'queueName']);
        exports.container.scopedSingleton('identityProvider', identity_provider_1.IdentityProvider, ['userRepository', 'verificationEmailProducer', 'monitoringService']);
        return exports.container;
    }
    catch (err) {
        throw err;
    }
});
//# sourceMappingURL=composition-root.js.map