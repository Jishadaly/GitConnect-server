"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const reqValidtionErr_1 = require("../utils/reqValidtionErr");
// Type guard to check if error is FieldValidationError
function isFieldValidationError(error) {
    return "path" in error && "location" in error;
}
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => {
            if (isFieldValidationError(error)) {
                return {
                    type: "field",
                    value: error.value?.toString() || "",
                    msg: error.msg,
                    param: error.path,
                    location: error.location || "body",
                };
            }
            // fallback for alternative validation errors
            return {
                type: "field",
                value: "",
                msg: error.msg,
                param: "unknown",
                location: "body",
            };
        });
        throw new reqValidtionErr_1.RequestValidationError(formattedErrors);
    }
    next();
};
exports.validateRequest = validateRequest;
