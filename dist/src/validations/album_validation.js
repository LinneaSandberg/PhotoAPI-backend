"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAlbumValidation = exports.createAlbumValidation = void 0;
/**
 * Validation rules for album
 */
const express_validator_1 = require("express-validator");
exports.createAlbumValidation = [
    // The title is required, trimmed and atlest 3 chars
    (0, express_validator_1.body)("title")
        .isString().withMessage("The title has to be a string").bail()
        .trim().isLength({ min: 3, max: 191 }).withMessage("The title has to be 3-191 chars"),
    (0, express_validator_1.body)("userId")
        .optional().isInt().withMessage("Has to be a integer"),
];
exports.updateAlbumValidation = [
    // The title is required, trimmed and atlest 3 chars
    (0, express_validator_1.body)("title")
        .isString().withMessage("The title has to be a string!").bail()
        .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),
];
