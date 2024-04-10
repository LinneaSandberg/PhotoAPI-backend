/**
 * Validation rules for Login
 */
import { body } from "express-validator";

const loginValidation = [
    body("email")
      .trim().isEmail().withMessage("The email needs to be a valid emailadress!").bail(),

    body("password")
    .isString().withMessage("The password has to be a string!").bail()
    .trim().notEmpty().withMessage("The password needs to contain something!"),
];

export default loginValidation;