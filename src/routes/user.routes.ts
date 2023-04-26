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

// Route - get all users - GET - /api/user/get_all
userRouter.get("/get_all", [validateJwt, isAdminUser], getAllUsers);

// Route - get my user info - GET - /api/user/get_my_info
userRouter.get("/get_my_info", [validateJwt], getMyUserInfo);

// Route - update user - PUT - /api/user/update/:user_id
userRouter.put(
  "/update/",
  [
    validateJwt,
    check("user_id", "El id del usuario es incorrecto")
      .optional()
      .trim()
      .notEmpty(),
    check("user_id", "El usuario no existe").custom(existUser),
    check("name", "El nombre es string")
      .optional()
      .trim()
      .optional()
      .notEmpty(),
    check("last_name", "El apellido es string").optional().trim().notEmpty(),
    check("email", "Ingrese un correo válido").optional().trim().isEmail(),
    check("is_active", "El estado es opcional").optional().trim().notEmpty(),

    fieldsValidate,
  ],
  updateUserInfo
);

// Route - delete user - DELETE - /api/user/delete/:user_id
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
