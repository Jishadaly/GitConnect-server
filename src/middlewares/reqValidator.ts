// src/validators/requestValidator.ts
import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import { RequestValidationError } from "../utils/reqValidtionErr";
import { IValidationErr } from "../types/validationErr"; // Import IValidationErr

// Request validation middleware
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Map express-validator's ValidationError to your custom IValidationErr
        const formattedErrors: IValidationErr[] = errors.array().map((error: ValidationError) => ({
            type: error.msg,         // error message becomes 'type'
            value: error.value || '', // value being validated
            msg: error.msg,          // validation error message
            param: error.param,      // the field name being validated
            location: error.location || 'body',  // assuming 'body' if no location specified
        }));

        // If there are validation errors, throw a custom validation error
        throw new RequestValidationError(formattedErrors);
    }

    // If validation passes, proceed to the next middleware or route handler
    next();
};
