// import { Request, Response } from "express";
// import { Role, User } from "../models";
// import bcrypt from 'bcrypt';

// import { createDefaultRoles } from '../helpers/db-helpers';
// import { RolesDefault } from "../common/constant";
// import { generateJwt } from "../helpers/generate-jwt";
// import { getArrayOrBoolean } from "../helpers/app-helpers";
// import { sendMail } from "../helpers/send-email";
// import { recoverPasswordMsg } from "../helpers/msgEmail";
// import jwt from 'jsonwebtoken';

// /* Login User */
// export const loginUser = async (req: Request, res: Response) => {
//     try {

//         let { email, password } = req.body;

//         /* Search if the user exists */
//         const user = await User.findOne({
//             attributes: ["userid", "ci", "name", "lastname", "password", "isactive", "passwordDefault"],
//             include: [{
//                 model: Role,
//                 as: "role_user"
//             }],
//             where: { email: email }
//         });

//         if (!user) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: `Usuario o Password incorrecto`
//             });
//         }

//         /* Get the string access data */
//         const userAcessData = (user as any).dataValues.role_user.access;

//         if (userAcessData == "false") {
//             return res.status(400).json({
//                 ok: false,
//                 msg: `Usuario no tiene acceso a este panel`
//             });
//         }

//         /* Verify de user state */
//         if (!user.isactive || user.isactive == null) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: `Usuario no se encuentra disponible`
//             });
//         }

//         /* Verify password */
//         const validPassword = bcrypt.compareSync(password, user.password);
//         if (!validPassword) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: `Usuario o Password incorrecto`
//             });
//         }

//         /* Generate JWT */
//         const token = await generateJwt(user.userid);

//         return res.status(200).json({
//             ok: true,
//             msg: "Usuario Logueado",
//             token,
//             passwordDefault: user.passwordDefault,
//             access: getArrayOrBoolean(userAcessData)
//         })

//     } catch (error) {
//         return res.status(500).json({
//             ok: false,
//             msg: "Internal Server Error",
//             error
//         })
//     }
// }


// /* Register Super Admin Function */
// export const registerSuperAdmin = async (req: Request, res: Response) => {
//     try {

//         /* Geth the data of body */
//         const { ci, name, lastname, address, phone, email, password } = req.body;

//         /* Verify if default roles exist */
//         let existDefaultRoles = await Role.findOne({ where: { name: RolesDefault.SUPERADMIN } });

//         /* Create default roles if not exist */
//         if (!existDefaultRoles) {
//             await createDefaultRoles();
//             existDefaultRoles = await Role.findOne({ where: { name: RolesDefault.SUPERADMIN } });
//         }

//         /* Verify if a superadmin is already created */
//         /* const existSuperadmin = await User.findOne({ where: { roleid: existDefaultRoles?.roleid } })

//         if (existSuperadmin) {
//             return res.status(201).json({
//                 ok: true,
//                 msg: "Ya se encuentra un superadmin creado"
//             })
//         } */

//         /* Encript Password */
//         const salt = bcrypt.genSaltSync();
//         const passwordEncrypt = bcrypt.hashSync(password, salt);

//         /* Create Superadmin */
//         await User.create({
//             ci,
//             name,
//             lastname,
//             address,
//             phone,
//             email,
//             password: passwordEncrypt,
//             isAdministrative: true,
//             roleid: existDefaultRoles?.roleid!
//         })

//         return res.status(201).json({
//             ok: true,
//             msg: "Superadmin Creado"
//         })

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             ok: false,
//             msg: "Internal Server Error",
//             error
//         })
//     }
// }

// /* Register user Function */
// export const registerUser = async (req: Request, res: Response) => {
//     try {

//         /* Geth the data of body */
//         const { ci, name, lastname, address, phone, email, password, image, ruc, roleid } = req.body;

//         /* Verify if a user with the same roleid was created */
//         const existUserWithRole = await User.findOne({
//             attributes: ["userid"],
//             where: { email, roleid }
//         });

//         if (existUserWithRole) {
//             return res.status(201).json({
//                 ok: true,
//                 msg: "Ya se encuentra un usuario creado con el mismo rol"
//             })
//         }

//         /* Get the string access data */
//         const rol = await Role.findByPk(roleid);

//         /* Encript Password */
//         const salt = bcrypt.genSaltSync();
//         const passwordEncrypt = bcrypt.hashSync(password, salt);

//         /* Create Superadmin */
//         await User.create({
//             ci,
//             name,
//             lastname,
//             address,
//             phone,
//             email,
//             image,
//             ruc,
//             password: passwordEncrypt,
//             isAdministrative: (rol?.access == "false") ? false : true,
//             roleid,
//             passwordDefault: true
//         })

//         return res.status(201).json({
//             ok: true,
//             msg: "Usuario Creado"
//         })

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             ok: false,
//             msg: "Internal Server Error",
//             error
//         })
//     }
// }

// /* Register user Function */
// export const resetPassword = async (req: Request, res: Response) => {
//     try {

//         /* Geth the data of body */
//         const { currentPassword, password } = req.body;

//         /* Get the userid */
//         const { userid } = req.user;

//         /* Get the password of the user */
//         const user = await User.findOne({ attributes: ["userid", "password"], where: { userid } });

//         /* Verify password */
//         const validPassword = bcrypt.compareSync(currentPassword, user?.password!);
//         if (!validPassword) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: `Password no coincide`
//             });
//         }

//         /* Encript Password */
//         const salt = bcrypt.genSaltSync();
//         const passwordEncrypt = bcrypt.hashSync(password, salt);

//         await user?.update({ password: passwordEncrypt });

//         return res.status(201).json({
//             ok: true,
//             msg: "Contraseña Actualizada"
//         })

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             ok: false,
//             msg: "Internal Server Error",
//             error
//         })
//     }
// }

// /* Recover Password Function */
// export const recoverPassword = async (req: Request, res: Response) => {
//     try {

//         const { email } = req.body;

//         /* Get user Data */
//         const user = await User.findOne({ where: { email: email, isactive: true } });

//         if (!user) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: `Usuario ${email} no encontrado`,
//             });
//         }

//         const { userid } = user;

//         /* Generate JWT */
//         const token = await generateJwt(userid);

//         const path = `${process.env.RESET_PASSWORD_URL}?userid=${userid}&token=${token}`

//         await sendMail(email, recoverPasswordMsg(path), "Recuperar Contraseña");

//         return res.status(200).json({
//             ok: true,
//             msg: `Solicitud de recuperación enviada a ${email}`
//         })
//     } catch (error) {
//         return res.status(500).json({
//             ok: false,
//             msg: "Internal Server Error",
//             error
//         })
//     }
// }

// /* Set new recovered password */
// export const setNewPassword = async (req: Request, res: Response) => {
//     interface jwtPayload {
//         id: string
//     }
//     try {
//         let { userid, token, password } = req.body;

//         const { id } = jwt.verify(`${token}`, `${process.env.TOKEN_SEED}`) as jwtPayload;

//         if (id != userid) {
//             return res.status(401).json({
//                 ok: false,
//                 msg: `No autorizado`
//             })
//         }

//         const salt = bcrypt.genSaltSync();
//         password = bcrypt.hashSync(password, salt);

//         await User.update({
//             password
//         }, { where: { userid: id } })

//         return res.status(200).json({
//             ok: true,
//             msg: `Contraseña actualizada`
//         })
//     } catch (error) {
//         return res.status(500).json({
//             ok: false,
//             msg: "Internal Server Error",
//             error
//         })
//     }
// }