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
        msg: `Usuario o constraseña incorrecto`,
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
        msg: `Usuario o contraseña incorrecto`,
      });
    }

    /* Generate JWT */
    const token = await generateJwt(user.user_id);

    return response.status(200).json({
      ok: true,
      msg: "Usuario autenticado",
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

/* Register user */
export const registerUser = async (request: Request, response: Response) => {
  try {

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
      msg: "Usuario creado correctamente",
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

// Update Password when user is logged
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

    /* Encrypt password */
    const salt = bcrypt.genSaltSync();
    const passwordEncrypt = bcrypt.hashSync(password, salt);

    /* Update password */
    await user?.update({ password: passwordEncrypt });

    return response.status(200).json({
      ok: true,
      msg: "Contraseña actualizada",
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

// Recover password used when user forgot password
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

    // Create path to send in email
    const path = `${process.env.RESET_PASSWORD_URL}?user_id=${user_id}&token=${token}`;

    /* Send email */
    await sendMail(email, recoverPasswordMsg(path), "Recuperar contraseña");

    return response.status(200).json({
      ok: true,
      msg: `Solicitud de recuperación enviada a ${email}`,
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

// Set new password when user recover password using the link sent to email
export const setNewPassword = async (request: Request, response: Response) => {
  interface jwtPayload {
    id: string;
  }
  try {
    let { user_id, token, password } = request.body;

    /* Verify token */
    const { id } = jwt.verify(
      `${token}`,
      `${process.env.TOKEN_SEED}`
    ) as jwtPayload;

    // Verify if the user_id is the same as the token
    if (id != user_id) {
      return response.status(401).json({
        ok: false,
        msg: `No autorizado`,
      });
    }

    /* Encrypt password */
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(password, salt);

    /* Update password */
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
