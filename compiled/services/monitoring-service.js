"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class MonitoringService {
    constructor(logger, processInstanceId, rmqConnection, rmqChannel, queueName) {
        this.processInstanceId = processInstanceId;
        this.logger = logger;
        this.connection = rmqConnection;
        this.ch = rmqChannel;
        this.queueName = queueName;
    }
    log(msg) {
        if (!process.env.TEST) {
            this.report(`${this.processInstanceId}: ${msg}`);
            this.logger.info(`${this.processInstanceId}: ${msg} \n`);
        }
    }
    report(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const msgBuffer = new Buffer(JSON.stringify(msg));
            try {
                return this.ch.sendToQueue(this.queueName, msgBuffer);
            }
            catch (err) {
                //report err
                this.log(err && err.message ? err.message : 'Error sending to Rabbit Queue');
            }
        });
    }
}
exports.MonitoringService = MonitoringService;
//# sourceMappingURL=monitoring-service.js.map