/**
 * Validation rules for album
 */
import { body } from "express-validator";

export const createAlbumValidation = [
    // The title is required, trimmed and atlest 3 chars
    body("title")
      .isString().withMessage("The title has to be a string").bail()
      .trim().isLength({ min: 3, max: 191 }).withMessage("The title has to be 3-191 chars"),

    body("userId")
      .optional().isInt().withMessage("Has to be a integer"),
];

export const updateAlbumValidation = [
    // The title is required, trimmed and atlest 3 chars
    body("title")
      .isString().withMessage("The title has to be a string!").bail()
      .trim().isLength({ min: 3, max: 191 }).withMessage("Has to be atleast 3 chars and max 191 chars"),
];