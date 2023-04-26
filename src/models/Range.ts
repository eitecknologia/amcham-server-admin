import {
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  CreationOptional
} from "sequelize";
import sequelize from "../database/config";

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
  }
});

export { Range, RangeAttributes}