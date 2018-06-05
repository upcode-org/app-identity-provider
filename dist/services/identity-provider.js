"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_provider_contracts_1 = require("../services/service-contracts/identity-provider-contracts");
class IdentityProvider {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    loginUser(loginRequest) {
        let response = new identity_provider_contracts_1.LoginUserResponse();
        // find user by username using the userRepository, check that password matches
        // jwt.sign 
        return response;
    }
    signupUser() {
    }
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=identity-provider.js.map