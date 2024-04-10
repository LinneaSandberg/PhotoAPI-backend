/**
 * Middleware for JSON Web Token - Auth
 */
import { Request, Response, NextFunction } from "express";
import { parseAndVerifyAuthToken } from "../../assistant/auth_assistant";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../types/Payload.types";

// Validation for JWT
export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {

    let token;

    try {
        token = parseAndVerifyAuthToken(req, "Bearer");
    } catch (err: any) {
        if (err instanceof Error) {
            return res.status(401).send({ status: "fail", message: err.message });
        }
        return res.status(401).send({ status: "fail", message: "The error is unknown" });
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send({ status: "error", message: "The access-token is undefined"});
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as unknown as JwtPayload;
        req.token = payload;

    } catch (err: any) {
        return res.status(401).send({ status: "fail", message: "Authorization required!" });
    }

    next();
}