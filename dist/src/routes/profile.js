"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * /profile routes
 */
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../controllers/profile_controller");
const request_validation_1 = __importDefault(require("../middlewares/request_validation"));
const user_validation_1 = require("../validations/user_validation");
const router = express_1.default.Router();
/**
 * GET /profile
 *
 * Get the user's profile with authentication
 */
router.get("/", profile_controller_1.getProfile);
/**
 * UPDATE /profile
 *
 * Update the user's profile
 */
router.patch("/", user_validation_1.updateUserValidation, request_validation_1.default, profile_controller_1.updateProfile);
exports.default = router;
