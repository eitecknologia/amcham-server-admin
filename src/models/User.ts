import {
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  CreationOptional,
} from "sequelize";
import sequelize from "../database/config";

interface UserAttributes
  extends Model<
    InferAttributes<UserAttributes>,
    InferCreationAttributes<UserAttributes>
  > {
  user_id: CreationOptional<number>;
  name: string;
  last_name: string;
  email: string;
  password: string;
  is_admin: CreationOptional<boolean>;
  is_active: CreationOptional<boolean>;
  createdAt: CreationOptional<Date>;
}

const User = sequelize.define<UserAttributes>("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export { User, UserAttributes };
