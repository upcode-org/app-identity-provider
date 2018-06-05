"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composition_root_1 = require("../../composition-root");
exports.attachContainer = (req, res, next) => {
    console.log('====Container Attached====');
    console.log('request from: ', req.headers['user-agent']);
    req['container'] = composition_root_1.container.createScope();
    return next();
};
//# sourceMappingURL=attach-container.js.map