/**
 * /photo routes
 */
import express from "express";
import { destroy, index, show, store, update } from "../controllers/photo_controller";
import { createPhotoValidation, updatePhotoValidation } from "../validations/photo_validation";
import requestValidation from "../middlewares/request_validation";

const router = express.Router();

/**
 * GET /photos
 * 
 * Get all photos
 */
router.get("/", index);

/**
 * GET /photos/photoId
 * 
 * Get a single photo
 */
router.get("/:photoId", show);

/**
 * POST /photos
 * 
 * Create a new photo
 */
router.post("/", createPhotoValidation, requestValidation, store);

/**
 * PATCH /photos/:photoId
 * 
 * Update a photo
 */
router.patch("/:photoId", updatePhotoValidation, requestValidation, update);

/**
 * DELETE /photos/:photoId
 * 
 * Delete a photo
 */
router.delete("/:photoId", destroy);

export default router;
