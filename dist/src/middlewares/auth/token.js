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
exports.tokenValidation = void 0;
const auth_assistant_1 = require("../../assistant/auth_assistant");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Validation for JWT
const tokenValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    try {
        token = (0, auth_assistant_1.parseAndVerifyAuthToken)(req, "Bearer");
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(401).send({ status: "fail", message: err.message });
        }
        return res.status(401).send({ status: "fail", message: "The error is unknown" });
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send({ status: "error", message: "The access-token is undefined" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.token = payload;
    }
    catch (err) {
        return res.status(401).send({ status: "fail", message: "Authorization required!" });
    }
    next();
});
exports.tokenValidation = tokenValidation;
