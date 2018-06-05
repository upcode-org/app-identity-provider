"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compositionRoot_1 = require("../compositionRoot");
exports.attachContainer = (req, res, next) => {
    console.log('====Container Attached====');
    console.log('request from: ', req.headers['user-agent']);
    req['container'] = compositionRoot_1.container.createScope();
    return next();
};
//# sourceMappingURL=attach-container.js.map