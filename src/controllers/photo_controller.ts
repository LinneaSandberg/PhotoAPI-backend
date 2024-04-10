/**
 * Photo Controller
 */
import { Request, Response } from "express";
import { createPhoto, deletePhoto, getPhoto, getPhotos, updatePhoto } from '../services/photo_service';
import { matchedData } from 'express-validator';
import { CreatePhoto, UpdatePhoto } from '../types/Photo.types';
import { Prisma } from '@prisma/client';

/**
 * Get the authenticated user's photos
 */
export const index = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const userId = req.token.sub;

    try {
        const photos = await getPhotos(userId);
        res.status(200).send({ status: "success", data: photos });
    } catch (err) {
        res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
    }
}

/**
 * Get a user's single Photo
 */
export const show = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const photoId = Number(req.params.photoId);
    const userId = req.token.sub;

    try {
        const photo = await getPhoto(photoId, userId);
        res.status(200).send({ status: "success", data: photo });

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "Photo not found!" });

        } else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
        }
}

/**
 * Create a new Photo
 */
export const store = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

    const userId = req.token.sub;

    const validatedData = matchedData(req) as CreatePhoto;

    try {
        const photo = await createPhoto(validatedData, userId);
        res.status(201).send({ status: "success", data: photo });

    } catch (err) {
        res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
    }
}

/**
 * Update a Photo
 */
export const update = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }

	const validatedData = matchedData(req) as UpdatePhoto;

    const photoId = Number(req.params.photoId);
    const userId = req.token.sub;

    try {
        const photo = await updatePhoto(photoId, validatedData, userId);
        res.status(200).send({ status: "success", data: photo });

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "The photo was Not Found" });

        } else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
}

/**
 * Delete a resource
 */
export const destroy = async (req: Request, res: Response) => {

    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    
    const photoId = Number(req.params.photoId);
    const userId = req.token.sub;

    try {
        await deletePhoto(photoId, userId);
        res.status(200).send({ status: "success", data: null });

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "The photo was Not Found" });
            
        } else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
}
