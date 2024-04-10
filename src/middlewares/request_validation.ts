/**
 * Request validation for middleware
 */
import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Validation for all incoming request
 */
const requestValidation = (req: Request, res: Response, next: NextFunction) => {

    const validationError = validationResult(req);

    // In case of Errors in validation then throw the errors and misson aborted!
    if (!validationError.isEmpty()) {
        res.status(400).send({
            status: "fail",
            data: validationError.array(),
        });
        return;
    }

    // If there if no errors in validation then misssion is on and request can continue!
    next();
}

export default requestValidation;

