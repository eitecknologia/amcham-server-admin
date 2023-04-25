import { NextFunction, Request, Response } from "express";
import { User } from '../models';
import jwt = require("jsonwebtoken");

interface jwtPayload {
    id: string
}

export const validateJwt = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.get('Authorization');
    token = (token) ? token.split(' ')[1] : token;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No se encontró un token"
        });
    }

    try {
        const { id } = jwt.verify(`${token}`, `${process.env.TOKEN_SEED}`) as jwtPayload;
        

        /* Search if the user exists */
        const user = await User.findOne({ where: { userid: id } });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario o Password incorrecto`
            });
        }

        if (!user.isactive) {
            return res.status(400).json({
                ok: false,
                msg: `Usuario no disponible`
            });
        }

        req.user = {
            userid: user.userid,
            name: user.name,
            lastname: user.lastname,
            roleid: user.roleid,
            isAdministrative: user.isAdministrative
        }

        return next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no válido"
        });
    }
}