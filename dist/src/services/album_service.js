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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlbumWithoutPhoto = exports.disconnectPhoto = exports.removePhotoFromAlbum = exports.addPhotoToAlbum = exports.photoByUser = exports.albumByUser = exports.updateAlbum = exports.createAlbum = exports.getAlbum = exports.getAlbums = void 0;
/**
 * Album service
 */
const prisma_1 = __importDefault(require("../prisma"));
/**
 * Get a user's albums
 */
const getAlbums = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirstOrThrow({
        select: {
            albums: true,
        },
        where: {
            id: userId,
        },
    });
    return user.albums;
});
exports.getAlbums = getAlbums;
/**
 * Get a user's single album
 */
const getAlbum = (albumId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.findUniqueOrThrow({
        where: {
            userId: userId,
            id: albumId,
        },
        include: {
            photos: true,
        }
    });
});
exports.getAlbum = getAlbum;
/**
 * Create a new album
 */
const createAlbum = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.create({
        data: Object.assign(Object.assign({}, data), { userId: userId }),
    });
});
exports.createAlbum = createAlbum;
/**
 * Update an existing album
 */
const updateAlbum = (albumId, data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.update({
        where: {
            id: albumId,
            userId: userId,
        },
        data,
    });
});
exports.updateAlbum = updateAlbum;
/**
 * Check if album is owned by user
 */
const albumByUser = (userId, albumId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.findUniqueOrThrow({
        where: {
            id: albumId,
            userId: userId,
        },
    });
});
exports.albumByUser = albumByUser;
/**
 * Check if photo(s) is owned by user
 */
const photoByUser = (userId, photoId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.findFirstOrThrow({
        where: {
            id: photoId,
            userId: userId,
        },
    });
});
exports.photoByUser = photoByUser;
/**
 * Add photo(s) to an album
 */
const addPhotoToAlbum = (userId, albumId, photoIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.update({
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
});
exports.addPhotoToAlbum = addPhotoToAlbum;
/**
 * Remove a photo from an album
 */
const removePhotoFromAlbum = (albumId, photoId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.update({
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
});
exports.removePhotoFromAlbum = removePhotoFromAlbum;
/**
 * Disconnect photos from album
 */
const disconnectPhoto = (albumId, photoIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.update({
        where: {
            id: albumId,
        },
        data: {
            photos: {
                disconnect: photoIds,
            },
        },
    });
});
exports.disconnectPhoto = disconnectPhoto;
/**
 * 	Delete an album
 */
const deleteAlbumWithoutPhoto = (albumId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.delete({
        where: {
            id: albumId,
        },
    });
});
exports.deleteAlbumWithoutPhoto = deleteAlbumWithoutPhoto;
