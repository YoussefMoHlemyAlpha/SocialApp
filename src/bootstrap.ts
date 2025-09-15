import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import chalk from "chalk";
import { baseRouter } from "./routes";
import { ApplicationException, IError } from "./utils/Error";
import { connectDB } from "./DB/DBConnection";
dotenv.config({
  path: path.resolve('./src/config/.env')
});

const app = express();

export const bootstrap = async() => {
  const port = process.env.PORT
  await connectDB()
  app.use(express.json());

  app.use(baseRouter)
  app.use((err:IError,req:Request,res:Response,next:NextFunction)=>{
    return res.status(err.statusCode||500).json({
        errMsg:err.message,
        status:err.statusCode||500,
        stack:err.stack
    }

)
  })
  app.listen(port, () => {
    console.log(chalk.bgCyanBright(`Server running on ${port}`));
  });
};
