"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main routes
 */
const express_1 = __importDefault(require("express"));
const albums_1 = __importDefault(require("./albums"));
const photos_1 = __importDefault(require("./photos"));
const profile_1 = __importDefault(require("./profile"));
const user_controller_1 = require("../controllers/user_controller");
const user_validation_1 = require("../validations/user_validation");
const request_validation_1 = __importDefault(require("../middlewares/request_validation"));
const login_validation_1 = __importDefault(require("../validations/login_validation"));
const token_1 = require("../middlewares/auth/token");
const router = express_1.default.Router();
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
router.use("/albums", token_1.tokenValidation, albums_1.default);
/**
 * /photos
 */
router.use("/photos", token_1.tokenValidation, photos_1.default);
/**
 * /profile
 */
router.use("/profile", token_1.tokenValidation, profile_1.default);
/**
 * POST /register
 *
 * Register a new user
 */
router.post("/register", user_validation_1.newUserValidation, request_validation_1.default, user_controller_1.registerUser);
/**
 * POST /login
 *
 * Log in a user
 */
router.post("/login", login_validation_1.default, request_validation_1.default, user_controller_1.loginUser);
/**
 * POST /refresh
 *
 * Get a new access token
 */
router.post("/refresh", user_controller_1.refresh);
/**
 * Catch-all route handler
 */
router.use((req, res) => {
    // Respond with 404 and a message in JSON-format
    res.status(404).send({
        message: "Not Found",
    });
});
exports.default = router;
