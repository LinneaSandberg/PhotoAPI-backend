/**
 * Assistant for the authentication
 */
import { Request } from "express";
import { AuthType } from "../types/Auth.types";

export const parseAndVerifyAuthToken = (req: Request, expectedType: AuthType) => {

    // Check if auth-header is missing, if so throw error
    if (!req.headers.authorization) {
        throw new Error("There is no auth-header!");
    }

    const [authSchema, payload] = req.headers.authorization.split(" ");

    // Check if auth-header is of expected type, otherwise throw error
    if (authSchema !== expectedType) {
        throw new Error(`Was expecting type: ${expectedType}, but insted got type: ${authSchema}`);
    }
    return payload;
}