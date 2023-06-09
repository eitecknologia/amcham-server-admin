import { Sequelize } from "sequelize";

const sequelize = new Sequelize(`${process.env.DATABASE_URL}`, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  dialect: "postgres",
});

export default sequelize;
