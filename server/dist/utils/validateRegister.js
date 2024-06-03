"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (options.username && options.username.length <= 2) {
        return [{ field: "username", message: "length must be greater than 2" }];
    }
    if (options.email) {
        if (!options.email.includes("@")) {
            return [{ field: "email", message: "Enter a Valid Email" }];
        }
        if (options.email.length <= 5) {
            return [{ field: "email", message: "Enter a Valid Email" }];
        }
    }
    if (options.password && options.password.length <= 5) {
        return [{ field: "password", message: "length must be greater than 5" }];
    }
    if (options.username && options.username.includes("@")) {
        return [{ field: "username", message: "Cannot include @" }];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map