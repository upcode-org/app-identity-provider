"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compositionRoot_1 = require("../compositionRoot");
exports.attachContainer = (req, res, next) => {
    req['container'] = compositionRoot_1.container.createScope();
    return next();
};
//# sourceMappingURL=attachContainer.js.map