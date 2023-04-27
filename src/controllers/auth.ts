import { Request, Response } from "express";
import { User, UserAttributes } from "../models";
import bcrypt from "bcrypt";

import { generateJwt } from "../helpers/generate-jwt";
import { sendMail } from "../helpers/send-mail";
import { recoverPasswordMsg } from "../helpers/msgEmail";

import jwt from "jsonwebtoken";
/* Login User */
export const loginUser = async (request: Request, response: Response) => {
  try {
    let { email, password } = request.body;

    /* Search if the user exists */
    const user = await User.findOne({
      attributes: [
        "user_id",
        "name",
        "last_name",
        "email",
        "password",
        "is_active",
      ],
      where: { email: email },
    });

    if (!user) {
      return response.status(400).json({
        ok: false,
        msg: `Usuario o Constraseña incorrecto`,
      });
    }

    /* Verify user state */
    if (!user.is_active || user.is_active == null) {
      return response.status(400).json({
        ok: false,
        msg: `Usuario se encuentra inactivo`,
      });
    }

    /* Verify password */
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return response.status(400).json({
        ok: false,
        msg: `Usuario o Password incorrecto`,
      });
    }

    /* Generate JWT */
    const token = await generateJwt(user.user_id);

    return response.status(200).json({
      ok: true,
      msg: "Usuario Autenticado",
      token,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

/* Register user Function */
export const registerUser = async (request: Request, response: Response) => {
  try {
    /* Geth the data of body */
    const { name, last_name, email, password }: UserAttributes = request.body;

    /* Verify if exists a user with the same email*/
    const existUser = await User.findOne({
      attributes: ["user_id"],
      where: { email: email },
    });

    if (existUser) {
      return response.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con este correo",
      });
    }

    /* Encrypt Password */
    const salt = bcrypt.genSaltSync();
    const passwordEncrypt = bcrypt.hashSync(password, salt);

    /* Create User */
    await User.create({
      name,
      last_name,
      email,
      password: passwordEncrypt,
    });

    return response.status(201).json({
      ok: true,
      msg: "User Created",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

// Update Password Function when user is logged
export const updatePassword = async (request: Request, response: Response) => {
  try {
    const { currentPassword, password } = request.body;

    /* Get the user_id */
    const { user_id } = request.user;

    /* Get the password of the user */
    const user = await User.findOne({
      attributes: ["user_id", "password"],
      where: { user_id },
    });

    /* Verify password */
    const validPassword = bcrypt.compareSync(currentPassword, user?.password!);
    if (!validPassword) {
      return response.status(400).json({
        ok: false,
        msg: `Contraseña no coincide`,
      });
    }

    /* Encrypt Password */
    const salt = bcrypt.genSaltSync();
    const passwordEncrypt = bcrypt.hashSync(password, salt);

    await user?.update({ password: passwordEncrypt });

    return response.status(200).json({
      ok: true,
      msg: "Contraseña Actualizada",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

// Recover Password Function used when user forgot password
export const recoverPassword = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;

    /* Get user Data */
    const user = await User.findOne({
      where: { email: email, is_active: true },
    });

    if (!user) {
      return response.status(400).json({
        ok: false,
        msg: `Usuario ${email} no encontrado`,
      });
    }

    const { user_id } = user;

    /* Generate JWT */
    const token = await generateJwt(user_id);

    const path = `${process.env.RESET_PASSWORD_URL}?user_id=${user_id}&token=${token}`;

    await sendMail(email, recoverPasswordMsg(path), "Recuperar Contraseña");

    return response.status(200).json({
      ok: true,
      msg: `Solicitud de recuperación enviada a ${email}`,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

// Set new password Function when user recover password using the link sent to email
export const setNewPassword = async (request: Request, response: Response) => {
  interface jwtPayload {
    id: string;
  }
  try {
    let { token, password } = request.body;

    const { id } = jwt.verify(
      `${token}`,
      `${process.env.TOKEN_SEED}`
    ) as jwtPayload;

    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(password, salt);

    await User.update(
      {
        password,
      },
      { where: { user_id: id } }
    );

    return response.status(200).json({
      ok: true,
      msg: `Contraseña actualizada`,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};
