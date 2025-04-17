// src/utills/errors/req-validation-error.ts
import { IValidationErr } from "../types/validationErr";

// Base error class for custom errors
export class CustomErr extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 500; // Default to internal server error
        Object.setPrototypeOf(this, CustomErr.prototype);
    }

    serializeError() {
        return [{ message: this.message }];
    }
}

// Validation error class
export class RequestValidationError extends CustomErr {
    statusCode = 400; // Bad request for validation errors

    constructor(public errors: IValidationErr[]) {
        super('Invalid request parameters');
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

// Add to your error utility file
export class NotFoundError extends CustomErr {
    statusCode = 404;

    constructor(public resource: string) {
        super(`${resource} not found`);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}