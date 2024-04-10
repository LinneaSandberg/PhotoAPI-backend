/**
 * Album types
 */
import { Album } from "@prisma/client";

export type CreateAlbum = Omit<Album, "id">;

export type UpdateAlbum = Partial<CreateAlbum>;

export type PhotoToAlbum = Pick<Album, "title">;


