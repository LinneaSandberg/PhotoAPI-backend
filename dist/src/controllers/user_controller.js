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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.loginUser = exports.registerUser = void 0;
/**
 * User controller
 */
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const user_service_1 = require("../services/user_service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_assistant_1 = require("../assistant/auth_assistant");
/**
 * Register a new user
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = (0, express_validator_1.matchedData)(req);
    const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10);
    const data = Object.assign(Object.assign({}, validatedData), { password: hashedPassword });
    try {
        const user = yield (0, user_service_1.newUser)(data);
        const responseWithoutPassword = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        };
        res.status(201).send({ status: "success", data: responseWithoutPassword });
    }
    catch (err) {
        return res.status(500).send({ status: "error", message: "Could not create a new user in photo_api" });
    }
});
exports.registerUser = registerUser;
/**
 * Log in a user
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Checks if a user with that email exists otherwise cant exit
    const user = yield (0, user_service_1.userByEmail)(email);
    if (!user) {
        return res.status(401).send({ status: "fail", message: "Access requires proper authorization!" });
    }
    // Check credentials against the hash; if not valid, exit
    const outcome = yield bcrypt_1.default.compare(password, user.password);
    if (!outcome) {
        return res.status(401).send({ status: "fail", message: "Access requires proper authorization!" });
    }
    const payload = {
        sub: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    };
    // Authenticate payload using the secret key for the access token and obtain the access token
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send({ status: "error", message: "Missing definition for access token secret" });
    }
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "5m",
    });
    // Make a refresh-token
    const refreshPayload = {
        sub: user.id,
    };
    // If no definition of refresh-token
    if (!process.env.REFRESH_TOKEN_SECRET) {
        return res.status(500).send({ status: "error", message: "Missing definition for refresh token secret" });
    }
    const refreshToken = jsonwebtoken_1.default.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME || "4h",
    });
    // Send an access-token in respond
    res.status(201).send({
        status: "success",
        data: {
            accessToken,
            refreshToken,
        },
    });
});
exports.loginUser = loginUser;
/**
 * 	Get a new access token
 */
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    try {
        token = (0, auth_assistant_1.parseAndVerifyAuthToken)(req, "Bearer");
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(401).send({ status: "fail", message: err.message });
        }
        return res.status(401).send({ status: "fail", message: "The error is some authorization unknown error" });
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
        return res.status(500).send({ status: "error", message: "No refresh token secret is defined" });
    }
    try {
        const refreshPayload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = yield (0, user_service_1.getUserById)(refreshPayload.sub);
        if (!user) {
            return res.status(500).send({ status: "error", message: "You dont have access!" });
        }
        const payload = {
            sub: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).send({ status: "error", message: "The access token secret is defined" });
        }
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "5m",
        });
        res.status(201).send({
            status: "success",
            data: {
                accessToken,
            },
        });
    }
    catch (err) {
        return res.status(401).send({ status: "fail", message: "Authorization required" });
    }
});
exports.refresh = refresh;
