import { User } from "../models/User";

export const allowDeactivate = async (id: number) => {
  const user = await User.findOne({ where: { user_id: id } });
  if (user !== null) {
    return user.is_admin;
  } else {
    console.log("Usuario no encontrado");
  }
};

export const existUser = async (id: number) => {
  const user = await User.findOne({ where: { user_id: id } });
  if (user !== null) {
    return true;
  } else {
    throw new Error("Usuario no encontrado");
  }
};
