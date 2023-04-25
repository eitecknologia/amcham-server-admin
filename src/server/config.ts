import express, { Express, Response } from "express";
import { authRouter, testRouter, userRouter } from "../routes/index";
import morgan = require("morgan");
import sequelize from "../database/config";
import cors from "cors";

import { createAdmin } from "../helpers/createAdmin";

export class Server {
  public app: Express;
  public port: string;
  // public prefix = "/api/";
  public paths: {
    testServer: string;
    user: string;
    auth: string;
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT!;
    this.paths = {
      testServer: "/",
      user: "/user",
      auth: "/auth",
    };

    /* Middleware */
    this.middleware();

    /* Routes */
    this.routes();

    /* DB Connection */
    this.dbConnection();
  }

  middleware() {
    /* Options for cors middleware */
    this.app.use(cors());

    /* Body Parse */
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    /* Morgan config */
    this.app.get("env") !== "production" && this.app.use(morgan("dev"));
  }

  routes() {
    /* Defined Routes */
    this.app.use(this.paths.testServer, testRouter);
    this.app.use(this.paths.user, userRouter);
    this.app.use(this.paths.auth, authRouter);

    /* Service not found - 404 */
    this.app.use((_req, res: Response) => {
      return res.status(404).json({
        ok: false,
        msg: "404 - Service not Found",
      });
    });
  }

  async dbConnection() {
    /* Connection to the DB Postgres*/
    try {
      const dbConnection = async () => {
        await Promise.all([
          /* Use when the DB has been changed careful can lost data*/
          // await sequelize.sync(),
          sequelize.authenticate(),
        ]);
      };
      await dbConnection();
      console.log("Connection has been established successfully.");
      
      // Create admin user if not exists
      await createAdmin();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening at port: `, this.port);
    });
  }

}
