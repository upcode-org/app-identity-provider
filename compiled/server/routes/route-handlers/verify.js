"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = (req, res) => {
    const processInstanceId = `002-${process.pid}-${new Date().getTime()}-${getRandomInt(1, 1000)}`;
    req.container.scopedDependency('processInstanceId', processInstanceId);
    const monitoringService = req.container.get('monitoringService');
    monitoringService.log(`${req.url} received new request from ${req.connection.remoteAddress}`);
    const identityProvider = req.container.get('identityProvider');
    const userId = req.query.id;
    return identityProvider.verifyUser(userId)
        .then((verifyUserResponse) => {
        monitoringService.log(`Success: ${JSON.stringify(verifyUserResponse)}`);
        return res.status(200).json(verifyUserResponse.modifiedUser);
    })
        .catch(err => {
        monitoringService.log(err);
        return res.status(500).json(err && err.stack ? err.stack : 'Internal Server Error');
    });
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//# sourceMappingURL=verify.js.map