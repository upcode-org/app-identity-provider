"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../route-handlers/login");
const signup_1 = require("../route-handlers/signup");
exports.router = express_1.Router();
exports.router.route('/login').post(login_1.login);
exports.router.route('/signup').post(signup_1.signup);
//# sourceMappingURL=routes.js.map