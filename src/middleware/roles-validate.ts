import { NextFunction, Request, Response } from "express";

// Check if the user is an administrator
export const isAdminUser = (request: Request, response: Response, next: NextFunction) => {

    const { is_admin } = request.user;

    if (!is_admin) {
        return response.status(401).json({
            ok: false,
            msg: `No autorizado`
        })
    }

    return next();
}