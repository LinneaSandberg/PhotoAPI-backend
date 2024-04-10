"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * /album routes
 */
const express_1 = __importDefault(require("express"));
const album_controller_1 = require("../controllers/album_controller");
const album_validation_1 = require("../validations/album_validation");
const request_validation_1 = __importDefault(require("../middlewares/request_validation"));
const router = express_1.default.Router();
/**
 * GET /albums
 *
 * Get all albums
 */
router.get("/", album_controller_1.index);
/**
 * GET /albums/:albumId
 *
 * Get a single album
 */
router.get("/:albumId", album_controller_1.show);
/**
 * POST /albums
 *
 * Create a new album
 */
router.post("/", album_validation_1.createAlbumValidation, request_validation_1.default, album_controller_1.store);
/**
 * PATCH /albums/:albumId
 *
 * Update a album
 */
router.patch("/:albumId", album_validation_1.updateAlbumValidation, request_validation_1.default, album_controller_1.update);
/**
 * POST /albums/:albumId/photos
 *
 * Add photo(s) to an album
 */
router.post("/:albumId/photos", request_validation_1.default, album_controller_1.addPhoto);
/**
 * DELETE /albums/:albumId/photos/:photoId
 *
 * Remove a photo from an album
 */
router.delete("/:albumId/photos/:photoId", album_controller_1.removePhoto);
/**
 * DELETE /albums/:albumId
 *
 * Delete an album
 */
router.delete("/:albumId", album_controller_1.destroy);
exports.default = router;
