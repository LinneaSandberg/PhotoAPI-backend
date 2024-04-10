"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validation rules for Login
 */
const express_validator_1 = require("express-validator");
const loginValidation = [
    (0, express_validator_1.body)("email")
        .trim().isEmail().withMessage("The email needs to be a valid emailadress!").bail(),
    (0, express_validator_1.body)("password")
        .isString().withMessage("The password has to be a string!").bail()
        .trim().notEmpty().withMessage("The password needs to contain something!"),
];
exports.default = loginValidation;
