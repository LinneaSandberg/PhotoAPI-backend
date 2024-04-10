"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.newUserValidation = void 0;
/**
 * Validation rules for Photo
 */
const express_validator_1 = require("express-validator");
const user_service_1 = require("../services/user_service");
exports.newUserValidation = [
    // Email is required, needs to be valid email and unique
    (0, express_validator_1.body)("email")
        .trim().isEmail().withMessage("The email needs to be a valid emailadress!").bail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_service_1.userByEmail)(value);
        if (user) {
            // If a user with that email alredy exist then trow an error
            throw new Error("The email you are trying to register, already exists!");
        }
    })),
    // Password is required, trimmed and has to be atlest 6 chars long
    (0, express_validator_1.body)("password")
        .isString().withMessage("The password has to be a string!").bail()
        .trim().isLength({ min: 6 }).withMessage("The password need to be atlest 6 chars long!"),
    // Firstname is required, trimmed and has to be atlest 3 chars long
    (0, express_validator_1.body)("first_name")
        .isString().withMessage("The firstname needs to be a string!").bail()
        .trim().isLength({ min: 3 }).withMessage("The firstname needs to be minimun 3 chars long!"),
    // Lastname is required, trimmed and has to be atlest 3 chars long
    (0, express_validator_1.body)("last_name")
        .isString().withMessage("The lastname needs to be a string!").bail()
        .trim().isLength({ min: 3 }).withMessage("The lastname needs to be minimun 3 chars long!"),
];
exports.updateUserValidation = [
    // Firstname is required, trimmed and has to be atlest 3 chars long
    (0, express_validator_1.body)("first_name")
        .optional()
        .isString().withMessage("The firstname needs to be a string!").bail()
        .trim().isLength({ min: 3 }).withMessage("The firstname needs to be minimun 3 chars long!"),
    // Lastname is required, trimmed and has to be atlest 3 chars long
    (0, express_validator_1.body)("last_name")
        .optional()
        .isString().withMessage("The lastname needs to be a string!").bail()
        .trim().isLength({ min: 3 }).withMessage("The lastname needs to be minimun 3 chars long!"),
    // email required + valid email (+ unique)
    (0, express_validator_1.body)("email")
        .optional()
        .trim().isEmail().withMessage("email has to be a valid email").bail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, user_service_1.userByEmail)(value);
        if (user) {
            // If a user with that email alredy exist then trow an error
            throw new Error("Email already exists");
        }
    })),
    // Password is required, trimmed and has to be atlest 6 chars long
    (0, express_validator_1.body)("password")
        .optional()
        .isString().withMessage("The password has to be a string!").bail()
        .trim().isLength({ min: 6 }).withMessage("The password need to be atlest 6 chars long!"),
];
