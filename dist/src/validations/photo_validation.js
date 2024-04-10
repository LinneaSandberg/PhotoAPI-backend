"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhotoValidation = exports.createPhotoValidation = void 0;
/**
 * Validation rules for Photo
 */
const express_validator_1 = require("express-validator");
exports.createPhotoValidation = [
    // The title is required, trimmed and atlest 3 chars
    (0, express_validator_1.body)("title")
        .isString().withMessage("The title has to be a string!").bail()
        .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),
    // The URL is required and a valid URL 
    (0, express_validator_1.body)("url")
        .isString().withMessage("The URL has to be a string!").bail()
        .trim().isURL().withMessage("The URL has to be a valid URL!"),
    // The comment is optional, trimmed and atleast 3 chars
    (0, express_validator_1.body)("comment")
        .optional()
        .isString().withMessage("The comment has to be a string!").bail()
        .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),
    // The userID is optional, number  
    (0, express_validator_1.body)("userId")
        .optional().isInt().withMessage("Has to be a integer"),
];
exports.updatePhotoValidation = [
    // The title is optional, trimmed and atlest 3 chars
    (0, express_validator_1.body)("title")
        .optional()
        .isString().withMessage("The title has to be a string!").bail()
        .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),
    // The URL is optional and a valid URL 
    (0, express_validator_1.body)("url")
        .optional()
        .isString().withMessage("The URL has to be a string!").bail()
        .trim().isURL().withMessage("The URL has to be a valid URL!"),
    // The comment is optional, trimmed and atleast 3 chars  
    (0, express_validator_1.body)("comment")
        .optional()
        .isString().withMessage("The comment has to be a string!").bail()
        .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),
];
