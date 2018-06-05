"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: "I got nothing!"
    });
};
//# sourceMappingURL=route-not-found.js.map