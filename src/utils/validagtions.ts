import { body, param, query } from 'express-validator';

export const userCreationRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is mandatory')
        .isString().withMessage('Username should be a string')
        .isLength({ min: 1, max: 39 }).withMessage('Username must be between 1 and 39 characters')
        .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
        .withMessage('Provided username does not match GitHub format'),
];

export const userSearchRules = [
    query('search')
        .optional()
        .trim()
        .isString().withMessage('Search input must be a string')
        .isLength({ min: 1 }).withMessage('Search query must not be empty')
];

export const usernameParamRules = [
    param('username')
        .trim()
        .notEmpty().withMessage('Username parameter is required')
        .isString().withMessage('Username parameter should be a string')
        .isLength({ min: 1, max: 39 }).withMessage('Username parameter must be between 1 and 39 characters')
];

export const userUpdateRules = [
    body('location')
        .optional()
        .trim()
        .isString().withMessage('Location should be a string')
        .isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),

    body('blog')
        .optional()
        .trim()
        .isURL().withMessage('Blog must be a valid URL')
        .isLength({ max: 200 }).withMessage('Blog URL too long (max 200 characters)'),

    body('bio')
        .optional()
        .trim()
        .isString().withMessage('Bio should be a string')
        .isLength({ max: 300 }).withMessage('Bio cannot exceed 300 characters')
];
