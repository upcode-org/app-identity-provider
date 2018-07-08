"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginUserRequest {
}
exports.LoginUserRequest = LoginUserRequest;
class LoginUserResponse {
    constructor() {
        this.authenticated = false;
        this.token = null;
    }
}
exports.LoginUserResponse = LoginUserResponse;
class SignupUserRequest {
}
exports.SignupUserRequest = SignupUserRequest;
class SignupUserResponse {
    constructor() {
        this.authenticated = false;
        this.token = null;
    }
}
exports.SignupUserResponse = SignupUserResponse;
class VerifyUserResponse {
}
exports.VerifyUserResponse = VerifyUserResponse;
//# sourceMappingURL=identity-provider-contracts.js.map