"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticator = (req, res, next) => {
    let authService = req.scopedContainer.resolve('AuthService');
    authService.authenticate()
        .then((servRes) => {
        if (servRes.isAuthentic) {
            return next();
        }
    })
        .catch((err) => {
        return res.status(401).send({ message: "Not authenticated", err: err });
    });
};
//# sourceMappingURL=authenticator.js.map