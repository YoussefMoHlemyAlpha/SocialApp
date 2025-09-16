import { Request, Response, NextFunction } from "express";
import { Document } from "mongoose";
import { Roles } from "../Enums/user.enum";

export interface IUserServices{
SignUp(req:Request,res:Response,next:NextFunction):Promise<Response>,
ConfirmEmail(req:Request,res:Response,next:NextFunction):Promise<Response>,
Login(req:Request,res:Response,next:NextFunction):Promise<Response>
}











export interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    emailOtp: {
        Otp: string;
        expireAt: Date
    };
    phone:string,
    isConfirmed:boolean,
    role:Roles

}



