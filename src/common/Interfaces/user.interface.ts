import { Request, Response, NextFunction } from "express";


export interface IUserServices{
SignUp(req:Request,res:Response,next:NextFunction):Promise<Response>,

}











export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    emailOtp: {
        Otp: string;
        expireAt: Date
    };
    phone:string

}



