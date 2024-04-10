/**
 * Validation rules for Photo
 */
import { body } from "express-validator";

export const createPhotoValidation = [
  // The title is required, trimmed and atlest 3 chars
  body("title")
    .isString().withMessage("The title has to be a string!").bail()
    .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),

  // The URL is required and a valid URL 
  body("url")
    .isString().withMessage("The URL has to be a string!").bail()
    .trim().isURL().withMessage("The URL has to be a valid URL!"),

  // The comment is optional, trimmed and atleast 3 chars
  body("comment")
    .optional()
    .isString().withMessage("The comment has to be a string!").bail()
    .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),

  // The userID is optional, number  
  body("userId")
    .optional().isInt().withMessage("Has to be a integer"),
];

export const updatePhotoValidation = [
  // The title is optional, trimmed and atlest 3 chars
  body("title")
    .optional()
    .isString().withMessage("The title has to be a string!").bail()
    .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),

  // The URL is optional and a valid URL 
  body("url")
    .optional()
    .isString().withMessage("The URL has to be a string!").bail()
    .trim().isURL().withMessage("The URL has to be a valid URL!"),
  
  // The comment is optional, trimmed and atleast 3 chars  
  body("comment")
    .optional()
    .isString().withMessage("The comment has to be a string!").bail()
    .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),
];