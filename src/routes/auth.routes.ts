import { Router } from "express";
import { check } from "express-validator";
import {
  loginUser,
  recoverPassword,
  registerUser,
  setNewPassword,
  updatePassword,
} from "../controllers/auth";
import { validateJwt } from "../middleware/jwt-validate";
import { isAdminUser } from "../middleware/roles-validate";
import { fieldsValidate } from "../middleware/fields-validate";
const authRouter: Router = Router();

/* Service - Login */
authRouter.post(
  "/login",
  [
    check("email", "Ingrese un correo válido").trim().isEmail(),
    check("password", "La contraseña es obligatoria").trim().notEmpty(),
    fieldsValidate,
  ],
  loginUser
);

/* Service - Create user */
authRouter.post(
  "/create",
  [
    validateJwt,
    isAdminUser,
    check("name", "El nombre es obligatorio").trim().notEmpty(),
    check("last_name", "El apellido es obligatorio").trim().notEmpty(),
    check("email", "Ingrese un correo válido").trim().isEmail(),
    check("password", "La contraseña es obligatoria")
      .trim()
      .notEmpty()
      .isLength({ min: 6 }),
    fieldsValidate,
  ],
  registerUser
);

/* Service - Update password */
authRouter.put(
  "/update_password",
  [
    validateJwt,
    check("currentPassword", "La contraseña actual es requerida")
      .trim()
      .notEmpty(),
    check("password", "Ingrese una contraseña de al menos 6 caracteres")
      .trim()
      .isLength({ min: 6 }),
    fieldsValidate,
  ],
  updatePassword
);

/* Service - Recover password */
authRouter.post(
  "/send_email_password",
  [check("email", "Ingrese un correo válido").isEmail(), fieldsValidate],
  recoverPassword
);

/* Service - Set new password */
authRouter.post(
  "/set_new_password",
  [
    check("user_id", "El id de usuario es obligatorio").notEmpty(),
    check("token", "Token obligatorio").notEmpty(),
    check(
      "password",
      "La constraseña debe contener al menos 6 caracteres"
    ).isLength({ min: 6 }),
    fieldsValidate,
  ],
  setNewPassword
);

export default authRouter;
