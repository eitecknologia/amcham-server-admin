import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/* Middleware that check the fields */
export const fieldsValidate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array({ onlyFirstError: true }).map(error => error.msg);
        return res.status(400).json({
            ok: false,
            msg: firstError[0],
            errors: errors.array({ onlyFirstError: true })
        });
    }

    return next();
}