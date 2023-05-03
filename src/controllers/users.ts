import { Request, Response } from "express";
import { User, UserAttributes } from "../models";
import { allowDeactivate } from "../helpers/db-helpers";

/* Get all users function*/
export const getAllUsers = async (request: Request, response: Response) => {
  try {
    const { rows: users } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "name",
        "last_name",
        "email",
        "is_admin",
        "is_active",
        "createdAt",
      ],
      where: { is_active: true },
      order: [["createdAt", "DESC"]],
    });

    return response.status(200).json({
      ok: true,
      msg: "Lista de usuarios",
      users,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

// Get user info by id when user is logged
export const getMyUserInfo = async (request: Request, response: Response) => {
  try {
    const { user_id } = request.user;

    const user = await User.findOne({
      attributes: [
        "user_id",
        "name",
        "last_name",
        "email",
        "is_admin",
        "is_active",
        "createdAt",
      ],
      where: { user_id },
    });

    return response.status(200).json({
      ok: true,
      msg: "Información del usuario",
      user,
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

// Update user info function
export const updateUserInfo = async (request: Request, response: Response) => {
  try {
    const user_id =
      request.body.user_id !== undefined
        ? request.body.user_id
        : request.user.user_id;
    const updates: Partial<UserAttributes> = {}; // Create an empty object to hold the updates

    if (request.body.name !== undefined) {
      updates.name = request.body.name;
    }

    if (request.body.last_name !== undefined) {
      updates.last_name = request.body.last_name;
    }

    if (request.body.email !== undefined) {
      updates.email = request.body.email;
    }

    if (request.body.is_active !== undefined) {
      if (
        (await allowDeactivate(request.user.user_id)) &&
        request.user.user_id !== user_id
      ) {
        updates.is_active = request.body.is_active;
      } else {
        return response.status(500).json({
          ok: false,
          msg: "No esté permitido desactivar este usuario",
        });
      }
    }

    await User.update(updates, { where: { user_id } });

    return response.status(200).json({
      ok: true,
      msg: "Usuario actualizado",
    });
  } catch (error) {
    return response.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

/* Delete User Function*/
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Get user id from params
    const { user_id } = req.params;
    console.log(user_id);

    // Delete user by id
    await User.destroy({ where: { user_id } });

    return res.status(200).json({
      ok: true,
      msg: "Usuario eliminado",
      user_id,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
      error,
    });
  }
};
