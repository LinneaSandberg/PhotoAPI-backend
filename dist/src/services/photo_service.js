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
exports.deletePhoto = exports.updatePhoto = exports.createPhoto = exports.getPhoto = exports.getPhotos = void 0;
/**
 * Photo service
 */
const prisma_1 = __importDefault(require("../prisma"));
/**
 * Get a user's photos
 */
const getPhotos = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirstOrThrow({
        select: {
            photos: true,
        },
        where: {
            id: userId,
        },
    });
    return user.photos;
});
exports.getPhotos = getPhotos;
/**
 * Get a user's single photo
 */
const getPhoto = (photoId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.findUniqueOrThrow({
        where: {
            userId: userId,
            id: photoId,
        }
    });
});
exports.getPhoto = getPhoto;
/**
 * Create a new photo
 */
const createPhoto = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.create({
        data: Object.assign(Object.assign({}, data), { userId: userId }),
    });
});
exports.createPhoto = createPhoto;
/**
 * Update an existing photo
 */
const updatePhoto = (photoId, data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.update({
        where: {
            id: photoId,
            userId: userId,
        },
        data,
    });
});
exports.updatePhoto = updatePhoto;
/**
 * Delete an existing photo
 */
const deletePhoto = (photoId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.delete({
        where: {
            id: photoId,
            userId: userId,
        },
    });
});
exports.deletePhoto = deletePhoto;
