import {
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
} from "sequelize";
import sequelize from "../database/config";

interface MediationAttributes
  extends Model<
    InferAttributes<MediationAttributes>,
    InferCreationAttributes<MediationAttributes>
  > {
  mediation_id: number;
  from_range: number;
  to_range: number;
  base: number;
  excess_percentage: number;
  last_update: Date;
}

const Mediation = sequelize.define<MediationAttributes>("Mediation", {
  mediation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  last_update: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Mediation;
