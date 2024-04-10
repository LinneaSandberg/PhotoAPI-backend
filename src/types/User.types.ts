/**
 * User types
 */
import { User } from "@prisma/client";

export type NewUser = Omit<User, "id">;

export type UpdateUser = Partial<NewUser>;