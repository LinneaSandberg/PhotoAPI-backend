"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.removePhoto = exports.addPhoto = exports.update = exports.store = exports.show = exports.index = void 0;
/**
 * Album Controller
 */
const album_service_1 = require("../services/album_service");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
/**
 * Get the authenticated user's albums
 */
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const userId = req.token.sub;
    try {
        const albums = yield (0, album_service_1.getAlbums)(userId);
        if (albums.length > 0) {
            res.status(200).send({ status: "success", data: albums });
        }
        else {
            res.status(404).send({ status: "error", message: "Albums not found!" });
            return;
        }
    }
    catch (err) {
        res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
    }
});
exports.index = index;
/**
 * Get a user's single album
 */
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const albumId = Number(req.params.albumId);
    const userId = req.token.sub;
    try {
        const album = yield (0, album_service_1.getAlbum)(albumId, userId);
        res.status(200).send({ status: "success", data: album });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "Album not found!" });
        }
        else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
});
exports.show = show;
/**
 * Create a new album
 */
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const userId = req.token.sub;
    const validatedData = (0, express_validator_1.matchedData)(req);
    try {
        const album = yield (0, album_service_1.createAlbum)(validatedData, userId);
        res.status(201).send({ status: "success", data: album });
    }
    catch (err) {
        res.status(500).send({ status: "error", message: "There was something that whent wrong when you tried to create a new album!" });
    }
});
exports.store = store;
/**
 * Update a authenticated user's album
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const validatedData = (0, express_validator_1.matchedData)(req);
    const albumId = Number(req.params.albumId);
    const userId = req.token.sub;
    try {
        const album = yield (0, album_service_1.updateAlbum)(albumId, validatedData, userId);
        res.status(200).send({ status: "success", data: album });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "The album was Not Found" });
        }
        else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to update data from the database" });
        }
    }
});
exports.update = update;
/**
 * Add photo(s) to an authenticated user's album
 */
const addPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const accessAlbum = yield (0, album_service_1.albumByUser)(userId, albumId);
        // // Check if photo(s) is owned by authenticated user 
        for (let i = 0; i < photoArr.length; i++) {
            const accessPhoto = yield (0, album_service_1.photoByUser)(userId, photoArr[i].id);
        }
        // If all photo(s) is owned by authenticated user then add to album
        const photo = yield (0, album_service_1.addPhotoToAlbum)(userId, albumId, photoArr);
        res.status(201).send({ status: "success", data: null });
    }
    catch (err) {
        // This handles both if album or photos is not own by authenticated user
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "Album or Photo Not Found" });
        }
        else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
});
exports.addPhoto = addPhoto;
/*
 * Remove a photo from an authenticated user's album
 */
const removePhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const userId = req.token.sub;
    const albumId = Number(req.params.albumId);
    const photoId = Number(req.params.photoId);
    try {
        // Check if album is owned by the authenticated user
        const accessAlbum = yield (0, album_service_1.albumByUser)(userId, albumId);
        // Check if photo is owned by authenticated user
        const accessPhoto = yield (0, album_service_1.photoByUser)(userId, photoId);
        const album = yield (0, album_service_1.removePhotoFromAlbum)(albumId, photoId);
        res.status(200).send({ status: "success", data: null });
    }
    catch (err) {
        // This handles both if album or photos is not own by authenticated user
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "Album or Photo Not Found" });
        }
        else {
            res.status(500).send({ status: "error", message: "Something went wrong when querying the database" });
        }
    }
});
exports.removePhoto = removePhoto;
/**
 * 	Delete an album
 */
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const userId = req.token.sub;
    const albumId = Number(req.params.albumId);
    try {
        // Check if album is owned by the authenticated user
        const albumUser = yield (0, album_service_1.albumByUser)(userId, albumId);
        if (albumUser && albumUser.userId === userId) {
            const disconnect = yield (0, album_service_1.disconnectPhoto)(albumId, req.body.photoId);
        }
        yield (0, album_service_1.deleteAlbumWithoutPhoto)(albumId);
        res.status(200).send({ status: "success", data: null });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "Album Not Found" });
        }
        else {
            res.status(500).send({ status: "error", message: "Something went wrong when querying the database" });
        }
    }
});
exports.destroy = destroy;
