"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("./route-handlers/login");
const signup_1 = require("./route-handlers/signup");
const verify_1 = require("./route-handlers/verify");
exports.router = express_1.Router();
exports.router.route('/').get((req, res) => {
    res.status(200).json('All good in the hood!');
});
exports.router.route('/login').post(login_1.login);
exports.router.route('/verify').get(verify_1.verify);
exports.router.route('/signup').post(signup_1.signup);
//# sourceMappingURL=routes.js.map