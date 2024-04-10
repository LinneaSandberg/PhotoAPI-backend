/**
 * Global types
 */
import { JwtPayload } from "../types/Payload.types";
import { User } from "@prisma/client";

declare global {
    namespace Express {
        export interface Request {
            token?: JwtPayload
            user?: User
        }
    }
}


