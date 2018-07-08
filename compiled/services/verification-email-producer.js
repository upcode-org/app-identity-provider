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
const rabbitMQ_1 = require("../connections/rabbitMQ");
class VerificationEmailProducer {
    constructor(rmqConnection) {
        this.queueName = 'app-signup-verification-emails'; //dev vs prod ENV
        this.connection = rmqConnection;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.ch = yield rabbitMQ_1.rabbitChannel(this.connection);
                //console.log('VerificationEmailProducer connected to RabbitMQ Channel');
            }
            catch (err) {
                console.log('VerificationEmailProducer could not connect to RabbitMQ Channel');
                return null;
            }
        });
    }
    produceMsg(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ch)
                yield this.connect();
            const msgBuffer = new Buffer(JSON.stringify(msg));
            try {
                return this.ch.sendToQueue(this.queueName, msgBuffer, { expiration: 60000 * 30 });
            }
            catch (err) {
                //report err
                console.log(err);
            }
        });
    }
}
exports.VerificationEmailProducer = VerificationEmailProducer;
//# sourceMappingURL=verification-email-producer.js.map