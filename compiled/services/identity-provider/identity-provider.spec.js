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
const chai_1 = require("chai");
require("mocha");
const composition_root_1 = require("../../composition-root");
const identity_provider_contracts_1 = require("./identity-provider-contracts");
describe('Identity Provider Test:', () => {
    let container;
    let timestamp = new Date().getTime();
    let password = '1234';
    before(() => __awaiter(this, void 0, void 0, function* () {
        container = yield composition_root_1.containerResolver();
    }));
    it('should signup a user', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let signupUserRequest = new identity_provider_contracts_1.SignupUserRequest();
        let result;
        signupUserRequest.email = `test-${timestamp}@email.com`;
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.firstName = 'firstName';
        try {
            result = yield identityProvider.signupUser(signupUserRequest);
        }
        catch (err) {
            result = err;
        }
        chai_1.expect(result).to.satisfy((result) => {
            if (result.token && !result.authenticated)
                return true;
            return false;
        });
    }));
    it('should fail signing up due to existing user', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let signupUserRequest = new identity_provider_contracts_1.SignupUserRequest();
        let result;
        signupUserRequest.email = `test-${timestamp}@email.com`;
        signupUserRequest.firstName = 'firstName';
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.password = password;
        try {
            result = yield identityProvider.signupUser(signupUserRequest);
        }
        catch (err) {
            result = err;
        }
        chai_1.expect(result.code).to.equal(1); // already registered code
    }));
    it('should fail signing up due to missing first name', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let signupUserRequest = new identity_provider_contracts_1.SignupUserRequest();
        let result;
        signupUserRequest.email = `test-${new Date().getTime()}@email.com`;
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.firstName = '';
        try {
            result = yield identityProvider.signupUser(signupUserRequest);
        }
        catch (err) {
            result = err;
        }
        chai_1.expect(result.code).to.equal(2); //failed validation code
    }));
    it('should fail signing up due to wrong first name type', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let signupUserRequest = new identity_provider_contracts_1.SignupUserRequest();
        let result;
        signupUserRequest.email = `test-${new Date().getTime()}@email.com`;
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.firstName = 122;
        try {
            result = yield identityProvider.signupUser(signupUserRequest);
        }
        catch (err) {
            result = err;
        }
        chai_1.expect(result.code).to.equal(2); //failed validation code
    }));
    it('should fail signing up due to missing email', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let signupUserRequest = new identity_provider_contracts_1.SignupUserRequest();
        let result;
        signupUserRequest.firstName = 'firstName';
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        try {
            result = yield identityProvider.signupUser(signupUserRequest);
        }
        catch (err) {
            result = err;
        }
        chai_1.expect(result.code).to.equal(2); //failed validation code
    }));
    it('should fail login due to unverified user', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let loginUserRequest = new identity_provider_contracts_1.LoginUserRequest();
        loginUserRequest.email = `test-${timestamp}@email.com`;
        loginUserRequest.password = password;
        const result = yield identityProvider.loginUser(loginUserRequest);
        chai_1.expect(result.authenticated).to.equal(false);
    }));
    it('should fail login due to wrong credentials', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let loginUserRequest = new identity_provider_contracts_1.LoginUserRequest();
        loginUserRequest.email = 'svega@upcode.co';
        loginUserRequest.password = 'wrongpassword';
        const result = yield identityProvider.loginUser(loginUserRequest);
        chai_1.expect(result.authenticated).to.equal(false);
    }));
    it('should login a user', () => __awaiter(this, void 0, void 0, function* () {
        const identityProvider = container.get('identityProvider');
        let loginUserRequest = new identity_provider_contracts_1.LoginUserRequest();
        loginUserRequest.email = 'svega@upcode.co';
        loginUserRequest.password = 'upcode-1985!';
        const result = yield identityProvider.loginUser(loginUserRequest);
        chai_1.expect(result.authenticated).to.equal(true);
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        const userRepository = container.get('userRepository');
        yield userRepository.userCollection.deleteOne({ email: `test-${timestamp}@email.com` })
            .then((res) => console.log('deleted: ', res.deletedCount));
    }));
});
//# sourceMappingURL=identity-provider.spec.js.map