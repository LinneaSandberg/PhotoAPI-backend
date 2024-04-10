/**
 * Photo service
 */
import prisma from "../prisma";
import { CreatePhoto, UpdatePhoto } from "../types/Photo.types";

/**
 * Get a user's photos
 */
export const  getPhotos = async (userId: number) => {
	const user = await prisma.user.findFirstOrThrow({
		select: {
			photos: true,
		},
		where: {
			id: userId,
		},
	});
	return user.photos;
}

/**
 * Get a user's single photo
 */
export const getPhoto = async (photoId: number, userId: number) => {
	return await prisma.photo.findUniqueOrThrow({
		where: {
			userId: userId,
			id: photoId,
		}

});
}

/**
 * Create a new photo
 */
export const createPhoto = async (data: CreatePhoto, userId: number) => {
	return await prisma.photo.create({
		data: {
			...data,
			userId: userId,
		},
	});
}

/**
 * Update an existing photo
 */
export const updatePhoto = async (photoId: number, data: UpdatePhoto, userId: number) => {
	return await prisma.photo.update({
		where: {
			id: photoId,
			userId: userId,
		},
		data,
	});
}

/**
 * Delete an existing photo
 */
export const deletePhoto = async (photoId: number, userId: number) => {
	return await prisma.photo.delete({
		where: {
			id: photoId,
			userId: userId,

		},
	});
}