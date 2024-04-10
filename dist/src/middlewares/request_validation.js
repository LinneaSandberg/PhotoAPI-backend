"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
/**
 * Validation for all incoming request
 */
const requestValidation = (req, res, next) => {
    const validationError = (0, express_validator_1.validationResult)(req);
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
};
exports.default = requestValidation;
