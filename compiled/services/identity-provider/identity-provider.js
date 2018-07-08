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
const fs_1 = require("fs");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const identity_provider_contracts_1 = require("../../services/identity-provider/identity-provider-contracts");
const cert = fs_1.readFileSync('.config/private_key_06-10-18.key');
class IdentityProvider {
    constructor(userRepository, verificationEmailProducer, monitoringService) {
        this.userRepository = userRepository;
        this.verificationEmailProducer = verificationEmailProducer;
        this.monitoringService = monitoringService;
    }
    loginUser(loginUserRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let loginUserResponse = new identity_provider_contracts_1.LoginUserResponse();
            this.monitoringService.log(`Fetching user from DB`);
            return this.userRepository.getUserByEmail(loginUserRequest.email)
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (user && user.verified && user.active && (yield this.doesPasswordMatch(loginUserRequest.password, user.password))) {
                    const token = jsonwebtoken_1.sign({ email: loginUserRequest.email, extra: 'some extra claims' }, cert, { algorithm: 'RS256' });
                    loginUserResponse.authenticated = true;
                    loginUserResponse.token = token;
                    this.monitoringService.log(`${loginUserRequest.email} authenticated.`);
                    return loginUserResponse;
                }
                // credentials not authenticated
                this.monitoringService.log(`${loginUserRequest.email} could not authenticate.`);
                return loginUserResponse;
            }));
        });
    }
    signupUser(signupUserRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield this.hashPassword(signupUserRequest.password);
            const now = new Date();
            const newUser = {
                "email": signupUserRequest.email,
                "password": hash,
                "first_name": signupUserRequest.firstName,
                "last_name": signupUserRequest.lastName,
                "verified": false,
                "active": false,
                "sign_up_date": now,
                "sign_up_date_tzo": now.getTimezoneOffset(),
                "roles": {}
            };
            this.monitoringService.log(`IdentityProvider service will create new user: ${JSON.stringify(newUser)}`);
            let signupUserResponse = new identity_provider_contracts_1.SignupUserResponse();
            return this.userRepository.createUser(newUser)
                .then((createdUser) => {
                this.monitoringService.log(`IdentityProvider created new user: ${JSON.stringify(createdUser)}`);
                this.sendToEmailQueue(createdUser);
                const token = jsonwebtoken_1.sign({ username: createdUser.email, extra: 'some extra claims' }, cert, { algorithm: 'RS256' });
                signupUserResponse.token = token;
                return signupUserResponse;
            });
        });
    }
    verifyUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.monitoringService.log(`User with id ${userId} requested to be verified.`);
            const response = new identity_provider_contracts_1.VerifyUserResponse();
            const result = yield this.userRepository.updateUserVerification(userId);
            if (result.ok === 1)
                response.modifiedUser = result.value;
            if (result.ok !== 1)
                throw new Error('Could not update user');
            this.monitoringService.log(`User with id ${userId} successfully verified.`);
            return response;
        });
    }
    sendToEmailQueue(createdUser) {
        const msg = {
            "userId": createdUser._id,
            "email": createdUser.email,
            "firstName": createdUser.first_name,
            "lastName": createdUser.last_name
        };
        this.monitoringService.log(`Sending a verification email to ${createdUser.email}`);
        this.verificationEmailProducer.produceMsg(msg);
    }
    hashPassword(password) {
        return bcrypt.hash(password, 10)
            .then(hash => hash);
    }
    doesPasswordMatch(password, hash) {
        return bcrypt.compare(password, hash)
            .then(verdict => verdict);
    }
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=identity-provider.js.map