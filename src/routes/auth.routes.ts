// import { Router } from "express";
// import { check } from "express-validator";
// import { loginUser, recoverPassword, registerSuperAdmin, registerUser, resetPassword, setNewPassword } from '../controller/auth';
// import { fieldsValidate } from "../middlewares/fields-validate";
// import { validateJwt } from "../middlewares/jwt-validate";
// import { verifyRoleId } from "../helpers/db-helpers";
// import { isAdministrativeUser } from "../middlewares/roles-validate";

// const authRouter: Router = Router();

// /* Service - Login */
// authRouter.post('/login', [
//     check('email', 'Ingrese un correo válido').trim().isEmail(),
//     check('password', 'La contraseña es obligatoria').trim().notEmpty(),
//     fieldsValidate
// ], loginUser);

// /* Service - Register SuperAdmin */
// authRouter.post('/register/superadmin', [
//     check('ci', 'El CI es obligatorio').notEmpty().isNumeric().isLength({ min: 10 }),
//     check('name', 'El nombre es obligatorio').notEmpty(),
//     check('lastname', 'El apellido es obligatorio').notEmpty(),
//     check('address', 'La dirección es obligatoria').trim(),
//     check('email', 'Ingrese un correo válido').trim().isEmail(),
//     check('password', 'Ingrese una contraseña de al menos 6 caracteres').trim().isLength({ min: 6 }),
//     check('phone', 'El teléfono es obligatorio').trim().notEmpty(),
//     check('ruc', 'Ingrese un ruc válido').trim().optional().isLength({ min: 13 }),
//     fieldsValidate
// ], registerSuperAdmin);

// /* Service - Register User */
// authRouter.post('/register/user', [
//     validateJwt,
//     isAdministrativeUser,
//     check('ci', 'El CI es obligatorio').notEmpty().isNumeric().isLength({ min: 10 }),
//     check('name', 'El nombre es obligatorio').notEmpty(),
//     check('lastname', 'El apellido es obligatorio').notEmpty(),
//     check('address', 'La dirección es obligatoria').trim(),
//     check('email', 'Ingrese un correo válido').trim().isEmail(),
//     check('password', 'Ingrese una contraseña de al menos 6 caracteres').trim().isLength({ min: 6 }),
//     check('phone', 'El teléfono es obligatorio').trim().notEmpty(),
//     check('ruc', 'Ingrese un ruc válido').trim().optional().isLength({ min: 13 }),
//     check('image', 'Ingrese una url válida').optional().trim().isURL(),
//     check('roleid', "El rol es obligatorio").trim().optional().isNumeric(),
//     check('roleid').custom(verifyRoleId),
//     fieldsValidate
// ], registerUser);

// /* Service - Recover pasword */
// authRouter.put('/reset_password', [
//     validateJwt,
//     isAdministrativeUser,
//     check('currentPassword', 'La contraseña actual es requerida').trim().notEmpty(),
//     check('password', 'Ingrese una contraseña de al menos 6 caracteres').trim().isLength({ min: 6 }),
//     fieldsValidate
// ], resetPassword);

// /* Service - Recover password */
// authRouter.post('/password_send_email', [
//     check('email', 'Ingrese un correo válido').isEmail(),
//     fieldsValidate
// ], recoverPassword);

// /* Service - Set new password */
// authRouter.post('/password_set_new', [
//     check('userid', 'Id de usuario Obligatorio').notEmpty(),
//     check('token', 'Token Obligatorio').notEmpty(),
//     check('password', 'El password debe contener al menos 6 caracteres').isLength({ min: 6 }),
//     fieldsValidate
// ], setNewPassword);

// export default authRouter;