import { Router } from "express";
import { fieldsValidate } from "../middlewares/fields-validate";
import { validateJwt } from "../middlewares/jwt-validate";
import { isAdministrativeUser } from "../middlewares/roles-validate";
import { deleteUser, getAllUsers, getMyUserInfo, getUserById, updateUser } from "../controller/users";
import { check } from "express-validator";
import { verifyRoleId, verifyUserId } from "../helpers/db-helpers";

const userRouter: Router = Router();

/* Service - get all users */
userRouter.get('/get_all', [
    validateJwt,
    isAdministrativeUser,
    fieldsValidate
], getAllUsers);

/* Service - get by id */
userRouter.get('/get_by_id/:userid', [
    validateJwt,
    isAdministrativeUser,
    check('userid', 'Ingrese un id válido').trim().notEmpty().isNumeric(),
    check('userid').custom(verifyUserId),
    fieldsValidate
], getUserById);

/* Service - get my info */
userRouter.get('/get_my_info', [
    validateJwt,
    isAdministrativeUser,
    fieldsValidate
], getMyUserInfo);

/* Service - update user */
userRouter.put('/update/:roleid', [
    validateJwt,
    isAdministrativeUser,
    check('ci', 'El CI es obligatorio').optional().notEmpty().isNumeric().isLength({ min: 10 }),
    check('name', 'El nombre es obligatorio').optional().notEmpty(),
    check('lastname', 'El apellido es obligatorio').optional().notEmpty(),
    check('address', 'La dirección es obligatoria').optional().trim(),
    check('email', 'Ingrese un correo válido').optional().trim().isEmail(),
    check('phone', 'El teléfono es obligatorio').optional().trim().notEmpty(),
    check('ruc', 'Ingrese un ruc válido').trim().optional().isLength({ min: 13 }),
    check('image', 'Ingrese una url válida').optional().trim().isURL(),
    check('roleid', "El rol es obligatorio").optional().trim().optional().isNumeric(),
    check('roleid').custom(verifyRoleId),
    fieldsValidate
], updateUser);

/* Service - get by id */
userRouter.delete('/delete/:userid', [
    validateJwt,
    isAdministrativeUser,
    check('userid', 'Ingrese un id válido').trim().notEmpty().isNumeric(),
    check('userid').custom(verifyUserId),
    fieldsValidate
], deleteUser);

export default userRouter;