"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_provider_contracts_1 = require("../service-contracts/identity-provider-contracts");
class IdentityProvider {
    // This module is responsible for the following:
    // Login a user
    // Signup a user
    loginUser(username) {
        return new identity_provider_contracts_1.LoginResponse();
    }
    signupUser() {
    }
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=identityProvider.js.map