import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import chalk from "chalk";
import { baseRouter } from "./routes";
import { IError, NotFoundError, unusedEmail } from "./utils/Error";
import { connectDB } from "./DB/DBConnection";
import { userModel } from "./DB/Models/user.model";
import { Server, Socket } from "socket.io";
import cors from 'cors'
import { decodeToken } from "./middleware/auth.middleware";
import { TokenTypes } from "./common/Enums/user.enum";
import { IUser } from "./common/Interfaces/user.interface";
import { log } from "console";
import { HydratedDocument } from "mongoose";
import { unknown } from "zod";
import { intialize } from "./Modules/gateway/gateway";

dotenv.config({
  path: path.resolve('./src/config/.env')
});

const app = express();

export const bootstrap = async () => {
  const port = process.env.PORT
  await connectDB()
  app.use(cors())
  app.use(express.json());

  const test = async () => {
    try {
      //const user = await userModel.findOneAndUpdate({_id:"68c84de6a20ee3389ab047a7"}, {firstName:"Tamer"}, {new:true});
      const users = await userModel.insertMany([{
        firstName: "Youssef",
        lastName: "Helmy",
        email: `${Date.now()}@gmail.com`,
        password: "3454596",
        confirmPassword: "3454596",
      }, {
        firstName: "Ahmed",
        lastName: "Ali",
        email: `${Date.now() + 1}@gmail.com`,
        password: "345459633",
        confirmPassword: "345459633",
      }])
      console.log({ users });
      if (!users) {
        throw new NotFoundError()
      }


    } catch (err) {
      console.log(err);
    }
    /*const user = await userModel.createOne({
        data: {
          firstName: "Youssef",
          lastName: "Helmy",
          email: `${Date.now()}@gmail.com`,
          password: "345456",
          confirmPassword: "345456"
        }
    });
  user.firstName="Ahmed"
  user.lastName="Ali"
  await user.save();*/

  }
  //test()
  app.use(baseRouter)
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode || 500).json({
      errMsg: err.message,
      status: err.statusCode || 500,
      stack: err.stack
    }

    )
  })
  const httpServer = app.listen(port, () => {
    console.log(chalk.bgCyanBright(`Server running on ${port}`));
  });


  intialize(httpServer)


};
