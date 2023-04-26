import { Router } from "express";
import { check } from "express-validator";
import { loginUser, recoverPassword, registerUser, setNewPassword } from '../controllers/auth';
import { validateJwt } from "../middleware/jwt-validate";
import { isAdminUser } from "../middleware/roles-validate";
import { fieldsValidate } from "../middleware/fields-validate";
const authRouter: Router = Router();

/* Service - Login */
authRouter.post('/login', [
    check('email', 'Ingrese un correo válido').trim().isEmail(),
    check('password', 'La contraseña es obligatoria').trim().notEmpty(),
    fieldsValidate
], loginUser);

// Route - create user - POST - /api/user/create
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
        fieldsValidate
    ],
    registerUser
  );


/* Service - Recover password */
authRouter.post('/password_send_email', [
    check('email', 'Ingrese un correo válido').isEmail(),
    fieldsValidate
], recoverPassword);

/* Service - Set new password */
authRouter.post('/password_set_new', [
    validateJwt,
    check('password', 'El password debe contener al menos 6 caracteres').isLength({ min: 6 }),
    fieldsValidate
], setNewPassword);

export default authRouter;