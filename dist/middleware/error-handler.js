"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (err, req, res, next) => {
    const monitoringService = req.container.resolve('MonitoringService');
    monitoringService.report(err);
    res.status(500).json({
        message: err.stack ? err.stack : 'Internal Server error'
    });
};
//# sourceMappingURL=error-handler.js.map