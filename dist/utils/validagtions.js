"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGetSortedRules = exports.userDeleteRules = exports.userUpdateRules = exports.usernameParamRules = exports.userSearchRules = exports.userCreationRules = void 0;
const express_validator_1 = require("express-validator");
exports.userCreationRules = [
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty().withMessage('Username is mandatory')
        .isString().withMessage('Username should be a string')
        .isLength({ min: 1, max: 39 }).withMessage('Username must be between 1 and 39 characters')
        .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
        .withMessage('Provided username does not match GitHub format'),
];
exports.userSearchRules = [
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isString().withMessage('Search input must be a string')
        .isLength({ min: 1 }).withMessage('Search query must not be empty')
];
exports.usernameParamRules = [
    (0, express_validator_1.param)('username')
        .trim()
        .notEmpty().withMessage('Username parameter is required')
        .isString().withMessage('Username parameter should be a string')
        .isLength({ min: 1, max: 39 }).withMessage('Username parameter must be between 1 and 39 characters')
];
exports.userUpdateRules = [
    (0, express_validator_1.body)('location')
        .optional()
        .trim()
        .isString().withMessage('Location should be a string')
        .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
    (0, express_validator_1.body)('blog')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Blog URL too long (max 200 characters)'),
    (0, express_validator_1.body)('bio')
        .optional()
        .trim()
        .isString().withMessage('Bio should be a string')
        .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters')
];
exports.userDeleteRules = [
    (0, express_validator_1.param)('id')
        .trim()
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID format'),
];
exports.userGetSortedRules = [
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['created_at', 'username', 'name', 'location', 'login'])
        .withMessage('Invalid sortBy field'),
    (0, express_validator_1.query)('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be either asc or desc'),
];
