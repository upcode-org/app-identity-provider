"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (err, req, res, next) => {
    const monitoringService = req.container.get('monitoringService');
    monitoringService.log(err);
    res.status(500).json({
        message: err.stack ? err.stack : 'Internal Server error'
    });
};
//# sourceMappingURL=error-handler.js.map