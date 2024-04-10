/**
 * /album routes
 */
import express from "express";
import { addPhoto, destroy, index, removePhoto, show, store, update } from "../controllers/album_controller";
import { createAlbumValidation, updateAlbumValidation } from "../validations/album_validation";
import requestValidation from "../middlewares/request_validation";

const router = express.Router();

/**
 * GET /albums
 *
 * Get all albums
 */
router.get("/", index);

/**
 * GET /albums/:albumId
 * 
 * Get a single album
 */
router.get("/:albumId", show);

/**
 * POST /albums
 * 
 * Create a new album
 */
router.post("/", createAlbumValidation, requestValidation, store);

/**
 * PATCH /albums/:albumId
 * 
 * Update a album
 */
router.patch("/:albumId", updateAlbumValidation, requestValidation, update);

/**
 * POST /albums/:albumId/photos
 * 
 * Add photo(s) to an album
 */
router.post("/:albumId/photos", requestValidation, addPhoto);

/**
 * DELETE /albums/:albumId/photos/:photoId
 * 
 * Remove a photo from an album
 */
router.delete("/:albumId/photos/:photoId", removePhoto);

/**
 * DELETE /albums/:albumId
 * 
 * Delete an album
 */
router.delete("/:albumId", destroy);

export default router;
