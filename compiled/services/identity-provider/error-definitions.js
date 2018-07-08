"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlreadyRegisteredError extends Error {
    constructor(message) {
        super(message);
        this.code = 1;
    }
}
exports.AlreadyRegisteredError = AlreadyRegisteredError;
class FieldValidationError extends Error {
    constructor(message) {
        super(message);
        this.code = 2;
    }
}
exports.FieldValidationError = FieldValidationError;
//# sourceMappingURL=error-definitions.js.map