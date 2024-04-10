/**
 * Album Controller
 */
import { addPhotoToAlbum, albumByUser, createAlbum, deleteAlbumWithoutPhoto, disconnectPhoto, getAlbum, getAlbums, photoByUser, removePhotoFromAlbum, updateAlbum } from '../services/album_service';
import { CreateAlbum, UpdateAlbum } from '../types/Album.types';
import { Request, Response } from "express";
import { matchedData } from 'express-validator';
import { Prisma } from '@prisma/client';

/**
 * Get the authenticated user's albums
 */
export const index = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const userId = req.token.sub;

    try {
        const albums = await getAlbums(userId);
        res.status(200).send({ status: "success", data: albums });
    } catch (err) {
        res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" })
    }
}

/**
 * Get a user's single album
 */
export const show = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const albumId = Number(req.params.albumId);
    const userId = req.token.sub;

    try {
        const album = await getAlbum(albumId, userId);
        res.status(200).send({ status: "success", data: album });
        
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "Album not found!" });

        } else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
}

/**
 * Create a new album
 */
export const store = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const userId = req.token.sub;

    const validatedData = matchedData(req) as CreateAlbum;

    try {
        const album = await createAlbum(validatedData, userId);
        res.status(201).send({ status: "success", data: album });

    } catch (err) {
        res.status(500).send({ status: "error", message: "There was something that whent wrong when you tried to create a new album!" });
    }
}

/**
 * Update a authenticated user's album
 */
export const update = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

	const validatedData = matchedData(req) as UpdateAlbum;

    const albumId = Number(req.params.albumId);
    const userId = req.token.sub;

    try {
        const album = await updateAlbum(albumId, validatedData, userId);
        res.status(200).send({ status: "success", data: album });

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).send({ status: "error", message: "The album was Not Found" });

		} else {
        res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to update data from the database" });
        }
    }
}

/**
 * Add photo(s) to an authenticated user's album
 */
export const addPhoto = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const albumId = Number(req.params.albumId);
    const userId = req.token.sub;

    const photoArr = Array.isArray(req.body)
        ? req.body
        : [req.body];

	try {
        // Check if album is owned by the authenticated user
        const accessAlbum = await albumByUser(userId, albumId);

        // // Check if photo(s) is owned by authenticated user 
        for (let i = 0; i < photoArr.length; i++) {
            const accessPhoto = await photoByUser(userId, photoArr[i].id);
        }

        // If all photo(s) is owned by authenticated user then add to album
        const photo = await addPhotoToAlbum(userId, albumId, photoArr);
        res.status(201).send({ status: "success", data: null });

	} catch (err) {
        // This handles both if album or photos is not own by authenticated user
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).send({ status: "error", message: "Album or Photo Not Found" });

		} else {
			res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
		}
	}
}

/*
 * Remove a photo from an authenticated user's album
 */
export const removePhoto = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const userId = req.token.sub;
    const albumId = Number(req.params.albumId);
    const photoId = Number(req.params.photoId);

    try {
        // Check if album is owned by the authenticated user
        const accessAlbum = await albumByUser(userId, albumId);

        // Check if photo is owned by authenticated user
        const accessPhoto = await photoByUser(userId, photoId);

        const album = await removePhotoFromAlbum(albumId, photoId);
        res.status(200).send({ status: "success", data: null });

    } catch (err) {
        // This handles both if album or photos is not own by authenticated user
		if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).send({ status: "error", message: "Album or Photo Not Found" });

		} else {
			res.status(500).send({ status: "error", message: "Something went wrong when querying the database" });
		}
	}
}

/**
 * 	Delete an album
 */
export const destroy = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const userId = req.token.sub;
    const albumId = Number(req.params.albumId);

    try {
        // Check if album is owned by the authenticated user
        const albumUser = await albumByUser(userId, albumId);

        if (albumUser && albumUser.userId === userId) {
            const disconnect = await disconnectPhoto(albumId, req.body.photoId);
        }
        
        await deleteAlbumWithoutPhoto(albumId);
        res.status(200).send({ status: "success", data: null });

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
			res.status(404).send({ status: "error", message: "Album Not Found" });

		} else {
			res.status(500).send({ status: "error", message: "Something went wrong when querying the database" });
		}
    }
}


