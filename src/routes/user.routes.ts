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

const userRouter: Router = Router();

// Route - get all users - GET - /api/user/get_all
userRouter.get("/get_all", [validateJwt, isAdminUser], getAllUsers);

// Route - get my user info - GET - /api/user/get_my_info
userRouter.get("/get_my_info", [validateJwt], getMyUserInfo);

// Route - update user - PUT - /api/user/update/:user_id
userRouter.put(
  "/update/:user_id",
  [
    validateJwt,
    check("user_id", "El id del usuario es obligatorio").trim().notEmpty(),
    check("name", "El nombre es obligatorio").trim().notEmpty(),
    check("last_name", "El apellido es obligatorio").trim().notEmpty(),
    check("email", "Ingrese un correo válido").trim().isEmail(),
    check("is_active", "El estado es obligatorio").trim().notEmpty(),
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
  ],
  deleteUser
);

export default userRouter;
