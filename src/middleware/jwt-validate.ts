import { NextFunction, Request, Response } from "express";
import { User } from "../models";

import jwt = require("jsonwebtoken");

interface jwtPayload {
  id: string;
}

export const validateJwt = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token = request.get("Authorization");
  token = token ? token.split(" ")[1] : token;

  if (!token) {
    return response.status(401).json({
      ok: false,
      msg: "Doesn't found token",
    });
  }

  try {
    const { id } = jwt.verify(
      `${token}`,
      `${process.env.TOKEN_SEED}`
    ) as jwtPayload;

    /* Search if the user exists */
    const user = await User.findOne({ where: { user_id: id } });
    if (!user) {
      return response.status(400).json({
        ok: false,
        msg: `Usuario o Password incorrecto`,
      });
    }

    if (!user.is_active) {
      return response.status(400).json({
        ok: false,
        msg: `Usuario inactivo`,
      });
    }

    request.user = {
      user_id: user.user_id,
      name: user.name,
      last_name: user.last_name,
      is_admin: user.is_admin,
      is_active: user.is_active,
    };

    return next();
  } catch (error) {
    return response.status(401).json({
      ok: false,
      msg: "Invalid token",
    });
  }
};
