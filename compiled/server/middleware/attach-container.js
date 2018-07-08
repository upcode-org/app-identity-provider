"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const composition_root_1 = require("../../composition-root");
exports.attachContainer = (req, res, next) => {
    req['container'] = composition_root_1.container.getScopedContainer();
    req['container'].scopedDependency('queueName', 'app-identity-provider-process-logs');
    return next();
};
//# sourceMappingURL=attach-container.js.map