import { Request, Response, NextFunction } from "express";
import { validationResult, FieldValidationError, ValidationError } from "express-validator";
import { RequestValidationError } from "../utils/reqValidtionErr";
import { IValidationErr } from "../types/validationErr";

// Type guard to check if error is FieldValidationError
function isFieldValidationError(error: ValidationError): error is FieldValidationError {
  return "path" in error && "location" in error;
}

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: IValidationErr[] = errors.array().map((error) => {
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

    throw new RequestValidationError(formattedErrors);
  }

  next();
};
