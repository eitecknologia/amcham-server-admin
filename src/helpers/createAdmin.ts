import { User } from "../models";
import bcrypt from "bcrypt";

/* Register user Function */
export const createAdmin = async () => {
  try {
    /* Verify if exists a user with the same email*/
    const user_num = await User.count({
      where: {
        is_admin: true,
      },
    });

    console.log("user_num", user_num);

    const defaultPassword = process.env.DEFAULT_PASSWORD || "123456";

    /* Encrypt Password */
    const salt = bcrypt.genSaltSync();
    const passwordEncrypt = bcrypt.hashSync(defaultPassword, salt);

    if (user_num === 0) {
      console.log("Creando administrador...");
      /* Create User */
      await User.create({
        name: "Administrator",
        last_name: "Administrator",
        email: "admin@admin.com",
        password: passwordEncrypt,
        is_admin: true,
      });

      console.log(
        `Administrador creado con email: admin@admin.com y contraseña: ${defaultPassword}`
      );
    } else {
      console.log("El administrador ya existe");
    }
  } catch (error) {
    console.log(error);
  }
};
