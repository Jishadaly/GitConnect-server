"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.RequestValidationError = exports.CustomErr = void 0;
// Base error class for custom errors
class CustomErr extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500; // Default to internal server error
        Object.setPrototypeOf(this, CustomErr.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.CustomErr = CustomErr;
// Validation error class
class RequestValidationError extends CustomErr {
    constructor(errors) {
        super('Invalid request parameters');
        this.errors = errors;
        this.statusCode = 400; // Bad request for validation errors
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeError() {
        console.log(this.errors, "this.errors from request validation error");
        return this.errors.map((err) => {
            return {
                message: `${err.msg} in ${err.location} at ${err.param}`, // Include the param for more clarity
            };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
// Add to your error utility file
class NotFoundError extends CustomErr {
    constructor(resource) {
        super(`${resource} not found`);
        this.resource = resource;
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
