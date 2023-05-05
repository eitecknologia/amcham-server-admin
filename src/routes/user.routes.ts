import { Router } from "express";
import { validateJwt } from "../middleware/jwt-validate";
import { isAdminUser } from "../middleware/roles-validate";
import {
  getAllUsers,
  updateUserInfo,
  getMyUserInfo,
  deleteUser,
} from "../controllers/users";
import { check } from "express-validator";
import { fieldsValidate } from "../middleware/fields-validate";
import { existUser } from "../helpers/db-helpers";

const userRouter: Router = Router();

// Service - Get all users
userRouter.get("/get_all", [validateJwt, isAdminUser], getAllUsers);

// Service - Get my user info
userRouter.get("/get_my_info", [validateJwt], getMyUserInfo);

// Service - Update user info
userRouter.put(
  "/update/",
  [
    validateJwt,
    check("user_id", "El id del usuario es incorrecto")
      .optional()
      .trim()
      .notEmpty(),
    check("user_id", "El usuario no existe").custom(existUser),
    check("name", "El nombre debe ser una cadena de caracteres")
      .optional()
      .trim()
      .optional()
      .notEmpty(),
    check("last_name", "El apellido debe ser una cadena de caracteres")
      .optional()
      .trim()
      .notEmpty(),
    check("email", "Ingrese un correo válido").optional().trim().isEmail(),
    check("is_active", "El estado debe ser boleano")
      .optional()
      .trim()
      .notEmpty(),

    fieldsValidate,
  ],
  updateUserInfo
);

// Service - Delete user
userRouter.delete(
  "/delete/:user_id",
  [
    validateJwt,
    isAdminUser,
    check("user_id", "El id del usuario es obligatorio").trim().notEmpty(),
    check("user_id", "El usuario no existe").custom(existUser),
    fieldsValidate,
  ],
  deleteUser
);

export default userRouter;
