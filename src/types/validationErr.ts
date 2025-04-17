// src/types/validationErr.ts
export interface IValidationErr {
    type: string;
    value: any; // Can be a string, number, or other types
    msg: string;
    param: string; // The path or field name being validated
    location: 'body' | 'query' | 'params'; // Restrict to valid locations
}
