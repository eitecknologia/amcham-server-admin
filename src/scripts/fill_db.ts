import { Sequelize } from "sequelize";
import * as data from "./ranges.json";

// To run this script use: npm run fill_db, it will create a js file

// This script creates the ranges table and fill it with the data from ranges.json
const sequelize = new Sequelize(
  "postgresql://postgres:N9BaDJO5aYmruvEftKGF@containers-us-west-72.railway.app:5890/amcham",
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    dialect: "postgres",
  }
);

import {
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  CreationOptional,
} from "sequelize";

interface RangeAttributes
  extends Model<
    InferAttributes<RangeAttributes>,
    InferCreationAttributes<RangeAttributes>
  > {
  range_id: CreationOptional<number>;
  range_type: string;
  from_range: number;
  to_range: number;
  base: number;
  excess_percentage: number;
  can_delete: boolean;
}

const Range = sequelize.define<RangeAttributes>("Range", {
  range_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  range_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  from_range: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  to_range: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  base: {
    type: DataTypes.FLOAT(8, 2),
    allowNull: false,
  },
  excess_percentage: {
    type: DataTypes.FLOAT(2, 2),
    allowNull: false,
  },
  can_delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Range.bulkCreate(data).then(() => {
  console.log("Created");
  sequelize.close();
});