import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB=()=>{
    try{
    mongoose.connect("mongodb://127.0.0.1:27017/socialapp")
    console.log(chalk.bgYellow("DB Connected sucessfully"));
    }catch(error){
    console.log(chalk.red("DB Connected failed"));
    }
}