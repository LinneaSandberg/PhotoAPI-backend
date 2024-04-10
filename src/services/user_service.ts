/**
 * User service
 */
import prisma from "../prisma";
import { NewUser } from "../types/User.types";


/**
 * Create a new user
 */
export const newUser = async (data: NewUser) => {
    return await prisma.user.create({
        data,
    });
}

/**
 * Get a user by it's email
 */
export const userByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
}

/**
 * Get a User by it´s id
 */
export const getUserById = async (id: number) => {
	return await prisma.user.findUnique({
			where: {
				id,
			},
		});
}
