/**
 * User controller 
 */
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { matchedData } from 'express-validator';
import { NewUser } from "../types/User.types";
import { getUserById, newUser, userByEmail } from "../services/user_service";
import { BodyForLogin, ResponseFromRegister } from "../interface/User.interface";
import { JwtPayload, RefreshPayload } from "../types/Payload.types";
import jwt from "jsonwebtoken";
import { parseAndVerifyAuthToken } from "../assistant/auth_assistant";

/**
 * Register a new user
 */
export const registerUser = async (req: Request, res: Response) => {

    const validatedData = matchedData(req);

    const hashedPassword = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10);

    const data = {
        ...validatedData,
        password: hashedPassword,
    } as NewUser;

    try {
        const user = await newUser(data);
        const responseWithoutPassword: ResponseFromRegister = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        }

        res.status(201).send({ status: "success", data: responseWithoutPassword });

    } catch (err) {
        return res.status(500).send({ status: "error", message: "Could not create a new user in photo_api" });
    }
}

/**
 * Log in a user
 */
export const loginUser = async (req: Request, res: Response) => {

    const { email, password } = req.body as BodyForLogin;

    // Checks if a user with that email exists otherwise cant exit
    const user = await userByEmail(email);
    if (!user) {
        return res.status(401).send({ status: "fail", message: "Access requires proper authorization!" });
    }

    // Check credentials against the hash; if not valid, exit
    const outcome = await bcrypt.compare(password, user.password);
    if (!outcome) {
        return res.status(401).send({ status: "fail", message: "Access requires proper authorization!" });
    }

    const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    }

    // Authenticate payload using the secret key for the access token and obtain the access token
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send({ status: "error", message: "Missing definition for access token secret"});
    }

    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "5m",
    });

    // Make a refresh-token
    const refreshPayload: RefreshPayload = {
        sub: user.id,
    }

    // If no definition of refresh-token
    if (!process.env.REFRESH_TOKEN_SECRET) {
        return res.status(500).send({ status: "error", message: "Missing definition for refresh token secret"});
    }

    const refresh_token = jwt.sign(refreshPayload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME || "4h",
    });

    // Send an access-token in respond
    res.status(200).send({
        status: "success",
        data: {
            access_token,
            refresh_token,
        },
    });
}

/**
 * 	Get a new access token
 */
export const refresh = async (req: Request, res: Response) => {
    let token: string; 

    try {
        token = parseAndVerifyAuthToken(req, "Bearer");

    } catch (err) {
        if (err instanceof Error) {
            return res.status(401).send({ status: "fail", message: err.message });
        }
        return res.status(401).send({ status: "fail", message: "The error is some authorization unknown error" });
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
		return res.status(500).send({ status: "error", message: "No refresh token secret is defined"});
    }

    try {
        const refreshPayload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as unknown as RefreshPayload;

        const user = await getUserById(refreshPayload.sub);
        if (!user) {
            return res.status(500).send({ status: "error", message: "You dont have access!" });
        }

        const payload: JwtPayload = {
            sub: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).send({ status: "error", message: "The access token secret is defined"});
        }

        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "5m",
        });

        res.status(200).send({
            status: "success",
            data: {
                access_token,
            },
        });
    } catch (err) {
        return res.status(401).send({ status: "fail", message: "Authorization required" });
    }
}

