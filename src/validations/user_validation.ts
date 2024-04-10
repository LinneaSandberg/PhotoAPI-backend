/**
 * Validation rules for Photo
 */
import { body } from "express-validator";
import { userByEmail } from "../services/user_service";

export const newUserValidation = [
    // Email is required, needs to be valid email and unique
    body("email")
      .trim().isEmail().withMessage("The email needs to be a valid emailadress!").bail()
      .custom(async (value) => {

        const user = await userByEmail(value);

        if (user) {
            // If a user with that email alredy exist then trow an error
            throw new Error("The email you are trying to register, already exists!");
        }
    }),

    // Password is required, trimmed and has to be atlest 6 chars long
    body("password")
      .isString().withMessage("The password has to be a string!").bail()
      .trim().isLength({ min: 6 }).withMessage("The password need to be atlest 6 chars long!"),

    // Firstname is required, trimmed and has to be atlest 3 chars long
    body("first_name")
      .isString().withMessage("The firstname needs to be a string!").bail()
      .trim().isLength({ min: 3 }).withMessage("The firstname needs to be minimun 3 chars long!"),

    // Lastname is required, trimmed and has to be atlest 3 chars long
    body("last_name")
      .isString().withMessage("The lastname needs to be a string!").bail()
      .trim().isLength({ min: 3 }).withMessage("The lastname needs to be minimun 3 chars long!"),
];

export const updateUserValidation = [
// Firstname is required, trimmed and has to be atlest 3 chars long
body("first_name")
  .optional()
  .isString().withMessage("The firstname needs to be a string!").bail()
  .trim().isLength({ min: 3 }).withMessage("The firstname needs to be minimun 3 chars long!"),

// Lastname is required, trimmed and has to be atlest 3 chars long
  body("last_name")
    .optional()
    .isString().withMessage("The lastname needs to be a string!").bail()
    .trim().isLength({ min: 3 }).withMessage("The lastname needs to be minimun 3 chars long!"),

  // email required + valid email (+ unique)
	body("email")
    .optional()
    .trim().isEmail().withMessage("email has to be a valid email").bail()
    .custom(async (value) => {
    
      const user = await userByEmail(value);

      if (user) {
      // If a user with that email alredy exist then trow an error
      throw new Error("Email already exists");
     }
    }),

  // Password is required, trimmed and has to be atlest 6 chars long
  body("password")
    .optional()
    .isString().withMessage("The password has to be a string!").bail()
    .trim().isLength({ min: 6 }).withMessage("The password need to be atlest 6 chars long!"),
];