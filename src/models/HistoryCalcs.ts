import {
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
} from "sequelize";
import sequelize from "../database/config";

interface HistoryCalcsAttributes
  extends Model<
    InferAttributes<HistoryCalcsAttributes>,
    InferCreationAttributes<HistoryCalcsAttributes>
  > {
  history_calcs_id: number;
  name: string;
  email: string;
  company_name: string;
  phone_number: string;
  calculation_type: string;
  consulted_amount: number;
  result: number;
  date: Date;
}

const HistoryCalcs = sequelize.define<HistoryCalcsAttributes>("HistoryCalcs", {
  history_calcs_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  company_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  calculation_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  consulted_amount: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  result: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default HistoryCalcs;
