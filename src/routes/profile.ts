/**
 * /profile routes
 */
import express from "express";
import { getProfile, updateProfile } from "../controllers/profile_controller";
import requestValidation from "../middlewares/request_validation";
import { updateUserValidation } from "../validations/user_validation";

const router = express.Router();

/**
 * GET /profile
 * 
 * Get the user's profile with authentication
 */
router.get("/", getProfile);

/**
 * UPDATE /profile
 * 
 * Update the user's profile
 */
router.patch("/", updateUserValidation, requestValidation, updateProfile);

export default router;