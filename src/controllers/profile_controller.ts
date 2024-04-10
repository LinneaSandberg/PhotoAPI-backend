/**
 * Profile controller
 */
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { getProfileWithId, updateUser } from '../services/profile_service';
import { matchedData } from 'express-validator';
import { UpdateUser } from '../types/User.types';
import { Prisma } from "@prisma/client";

/**
 * 	Get the user's profile using authentication
 */
export const getProfile = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access something you can't access, Ciaoo! Please dont remove the autentication")
    }

    // Get the accurate user's profile using ID to identify
    const profile = await getProfileWithId(req.token.sub);

    if (profile !== null) {
        res.status(200).send({ status: "success", data: {
                id: profile.id,
                email: profile.email,
                first_name: profile.first_name,
                last_name: profile.last_name,
            }
        });
    }
}

/**
 * Update the user's profile
 */
export const updateProfile = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const validatedData = matchedData(req) as UpdateUser;

    const userId = req.token.sub;

    if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10);
    }

    try {
        const profile = await updateUser(userId, validatedData);
        res.status(200).send({ status: "success", data: {
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
        } });

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).send({ status: "error", message: "The user was Not Found" });

		} else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to update data from the database" });
        }
    }
}
