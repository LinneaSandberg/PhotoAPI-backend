/**
 * Main routes
 */
import express from "express";
import albumRoutes from "./albums";
import photoRoutes from "./photos";
import profileRoutes from "./profile";
import { loginUser, refresh, registerUser } from "../controllers/user_controller";
import { newUserValidation } from "../validations/user_validation";
import requestValidation from "../middlewares/request_validation";
import loginValidation from "../validations/login_validation";
import { tokenValidation } from "../middlewares/auth/token";

const router = express.Router();

/**
 * GET /
 */
router.get("/", (req, res) => {
	res.send({
		message: "But first, let me make som haXXor magic 🪄 https://www.youtube.com/watch?v=qP2VWMr6Vo0",
	});
});

/**
 * /albums
 */
router.use("/albums", tokenValidation, albumRoutes);

/**
 * /photos
 */
router.use("/photos", tokenValidation, photoRoutes);

/**
 * /profile
 */
router.use("/profile", tokenValidation, profileRoutes);

/**
 * POST /register
 * 
 * Register a new user
 */
router.post("/register", newUserValidation, requestValidation, registerUser);

/**
 * POST /login
 * 
 * Log in a user
 */
router.post("/login", loginValidation, requestValidation, loginUser);

/**
 * POST /refresh
 * 
 * Get a new access token
 */
router.post("/refresh", refresh);

/**
 * Catch-all route handler
 */
router.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		message: "Not Found",
	});
});

export default router;
