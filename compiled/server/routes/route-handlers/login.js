"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_provider_contracts_1 = require("../../../services/identity-provider/identity-provider-contracts");
exports.login = (req, res) => {
    const processInstanceId = `003-${process.pid}-${new Date().getTime()}-${getRandomInt(1, 1000)}`;
    req.container.scopedDependency('processInstanceId', processInstanceId);
    const monitoringService = req.container.get('monitoringService');
    monitoringService.log(`${req.url} received new request from ${req.connection.remoteAddress}`);
    const loginUserRequest = new identity_provider_contracts_1.LoginUserRequest();
    loginUserRequest.email = req.body.email;
    loginUserRequest.password = req.body.password;
    const identityProvider = req.container.get('identityProvider');
    return identityProvider.loginUser(loginUserRequest)
        .then((loginUserResponse) => {
        monitoringService.log(`Success: ${JSON.stringify(loginUserResponse)}`);
        const status = loginUserResponse.authenticated ? 200 : 401;
        return res.status(status).json(loginUserResponse);
    })
        .catch(err => {
        monitoringService.log(err);
        return res.status(500).json(err && err.stack ? err.stack : 'Internal Server Error');
    });
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//# sourceMappingURL=login.js.map