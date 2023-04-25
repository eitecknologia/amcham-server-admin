import { Request, Response } from "express";
import { User, UserAttributes } from "../models";

// Create user function
export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, last_name, email, password }: UserAttributes = request.body;

    const user = await User.create({
      name,
      last_name,
      email,
      password
    }
    );
    
    return response.status(201).json({
      ok: true,
      msg: "User Created",
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
      msg: "Users List",
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
      msg: "User Information",
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
export const updateUser = async (request: Request, response: Response) => {
  try {
    let { name, last_name, email, is_active }: UserAttributes = request.body;
    const { user_id } = request.user;

    await User.update(
      {
        name,
        last_name,
        email,
        is_active,
      },
      { where: { user_id } }
    );

    return response.status(200).json({
      ok: true,
      msg: "User Updated",
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
    const { user_id } = req.user;

    // Delete user by id
    await User.destroy({ where: { user_id } });

    return res.status(200).json({
      ok: true,
      msg: "User Deleted",
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
