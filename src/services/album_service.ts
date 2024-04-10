/**
 * Album service
 */
import prisma from "../prisma";
import { CreateAlbum, UpdateAlbum } from "../types/Album.types";
import { PhotoId } from "../types/Photo.types";

/**
 * Get a user's albums
 */
export const getAlbums = async (userId: number) => {
	const user = await prisma.user.findFirstOrThrow({
		select: {
			albums: true,
		},
		where: {
			id: userId,
		},
	});

	return user.albums;
}

/**
 * Get a user's single album
 */
export const getAlbum = async (albumId: number, userId: number) => {
	return await prisma.album.findUniqueOrThrow({
		where: {
			userId: userId,
			id: albumId,
		},
		include: {
			photos: true,
		}
	});
}

/**
 * Create a new album
 */
export const createAlbum = async (data: CreateAlbum, userId: number) => {
	return await prisma.album.create({
		data: {
			...data,
			userId: userId,
		},
	});
}	

/**
 * Update an existing album
 */
export const updateAlbum = async (albumId: number, data: UpdateAlbum, userId: number) => {
	return await prisma.album.update({
		where: {
			id: albumId,
			userId: userId,
		},
		data,
	});
}

/**
 * Check if album is owned by user
 */
export const albumByUser = async (userId: number, albumId: number) => {
	return await prisma.album.findUniqueOrThrow({
		where: {
			id: albumId,
			userId: userId,
		},
	});
}

/**
 * Check if photo(s) is owned by user
 */
export const photoByUser = async (userId: number, photoId: number) => {
	return await prisma.photo.findFirstOrThrow({
		where: {
			id: photoId,
			userId: userId,
		},
	});
}

/**
 * Add photo(s) to an album
 */
export const addPhotoToAlbum = async (userId: number, albumId: number, photoIds: PhotoId | PhotoId[]) => {
	return await prisma.album.update({
		where: {
			id: albumId,
			userId: userId,
		},
		data: {
			photos: {
				connect: photoIds,
			},
		},
	});
}

/**
 * Remove a photo from an album
 */
export const removePhotoFromAlbum = async (albumId: number, photoId: number) => {
	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {
				disconnect: {
					id: photoId,
				},
			},
		},
		include: {
			photos: true,
		},
	});
}

/**
 * Disconnect photos from album
 */
export const disconnectPhoto = async (albumId: number, photoIds: PhotoId | PhotoId[]) => {
	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {
				disconnect: photoIds,
			},
		},
	});
}

/**
 * 	Delete an album
 */
export const deleteAlbumWithoutPhoto = async (albumId: number) => {
	return await prisma.album.delete({
		where: {
			id: albumId,
		},
	});
}