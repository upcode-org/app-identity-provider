"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_provider_contracts_1 = require("../service-contracts/identity-provider-contracts");
//========== ROUTE HANDLER ==============
exports.login = (req, res) => {
    console.log('==== POST/login ====');
    console.log("req body", req.body);
    const username = req.body.username;
    const password = req.body.password;
    const loginRequest = new identity_provider_contracts_1.LoginUserRequest(username, password);
    const identityProvider = req.container.resolve('IdentityProvider');
    const response = identityProvider.loginUser(loginRequest);
    const status = response.authenticated ? 200 : 401;
    return res.status(status).json(response);
};
//========== ROUTE HANDLER ==============
//# sourceMappingURL=login.js.map