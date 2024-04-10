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
exports.destroy = exports.update = exports.store = exports.show = exports.index = void 0;
const photo_service_1 = require("../services/photo_service");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
/**
 * Get the authenticated user's photos
 */
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const userId = req.token.sub;
    try {
        const photos = yield (0, photo_service_1.getPhotos)(userId);
        if (photos.length > 0) {
            res.status(200).send({ status: "success", data: photos });
        }
        else {
            res.status(404).send({ status: "error", message: "Photos not found!" });
            return;
        }
    }
    catch (err) {
        res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
    }
});
exports.index = index;
/**
 * Get a user's single Photo
 */
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const photoId = Number(req.params.photoId);
    const userId = req.token.sub;
    try {
        const photo = yield (0, photo_service_1.getPhoto)(photoId, userId);
        res.status(200).send({ status: "success", data: photo });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "Photo not found!" });
        }
        else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
});
exports.show = show;
/**
 * Create a new Photo
 */
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const userId = req.token.sub;
    const validatedData = (0, express_validator_1.matchedData)(req);
    try {
        const photo = yield (0, photo_service_1.createPhoto)(validatedData, userId);
        res.status(201).send({ status: "success", data: photo });
    }
    catch (err) {
        res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
    }
});
exports.store = store;
/**
 * Update a Photo
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const validatedData = (0, express_validator_1.matchedData)(req);
    const photoId = Number(req.params.photoId);
    const userId = req.token.sub;
    try {
        const photo = yield (0, photo_service_1.updatePhoto)(photoId, validatedData, userId);
        res.status(200).send({ status: "success", data: photo });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "The photo was Not Found" });
        }
        else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
});
exports.update = update;
/**
 * Delete a resource
 */
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        throw new Error("Trying to access autenticated user but none exists. Did you remove autentication from this route? 🤬");
    }
    const photoId = Number(req.params.photoId);
    const userId = req.token.sub;
    try {
        yield (0, photo_service_1.deletePhoto)(photoId, userId);
        res.status(200).send({ status: "success", data: null });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).send({ status: "error", message: "The photo was Not Found" });
        }
        else {
            res.status(500).send({ status: "error", message: "There was an issue encountered while attempting to retrieve data from the database" });
        }
    }
});
exports.destroy = destroy;
