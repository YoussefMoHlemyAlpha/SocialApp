import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB=()=>{
    try{
    mongoose.createConnection('mongodb://localhost:27017/')
    console.log(chalk.bgYellow("DB Connected sucessfully"));
    }catch(error){
    console.log(chalk.red("DB Connected failed"));
    }
}