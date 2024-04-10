/**
 * Profile service
 */
import prisma from "../prisma";
import { UpdateUser } from "../types/User.types";

/**
 * Get the user's profile using their ID
 */
export const getProfileWithId = async (id: number) => {
	return await prisma.user.findUnique({
		where: {
			id,
		},
	});
}

/**
 * Update user's profile
 */
export const updateUser = async (userId: number, data: UpdateUser) => {
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data,
	});
}