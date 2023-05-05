import { User } from "../models/User";

// Validate if user can be deactivated
export const allowDeactivate = async (id: number) => {
  const user = await User.findOne({ where: { user_id: id } });
  if (user !== null) {
    return user.is_admin;
  } else {
    console.log("No permitido");
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
