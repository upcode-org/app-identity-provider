"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginUserResponse {
    constructor() {
        this.authenticated = false;
        this.token = null;
    }
}
exports.LoginUserResponse = LoginUserResponse;
class LoginUserRequest {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
exports.LoginUserRequest = LoginUserRequest;
//# sourceMappingURL=identity-provider-contracts.js.map