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
exports.updateProfile = exports.getProfile = void 0;
/**
 * Profile controller
 */
const bcrypt_1 = __importDefault(require("bcrypt"));
const profile_service_1 = require("../services/profile_service");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
/**
 * 	Get the user's profile using authentication
 */
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access something you can't access, Ciaoo! Please dont remove the autentication");
    }
    // Get the accurate user's profile using ID to identify
    const profile = yield (0, profile_service_1.getProfileWithId)(req.token.sub);
    if (profile !== null) {
        res.status(200).send({ status: "success", data: {
                id: profile.id,
                email: profile.email,
                first_name: profile.first_name,
                last_name: profile.last_name,
            }
        });
    }
});
exports.getProfile = getProfile;
/**
 * Update the user's profile
 */
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const validatedData = (0, express_validator_1.matchedData)(req);
    const userId = req.token.sub;
    if (validatedData.password) {
        validatedData.password = yield bcrypt_1.default.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10);
    }
    try {
        const profile = yield (0, profile_service_1.updateUser)(userId, validatedData);
        res.status(200).send({ status: "success", data: {
                id: profile.id,
                email: profile.email,
                first_name: profile.first_name,
                last_name: profile.last_name,
            } });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "The user was Not Found" });
        }
        else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to update data from the database" });
        }
    }
});
exports.updateProfile = updateProfile;
