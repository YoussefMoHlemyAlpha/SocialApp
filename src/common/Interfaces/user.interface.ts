import { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";
import { Roles } from "../Enums/user.enum";
import { OtpType } from "../Types/user.type";

export interface IUserServices{
SignUp(req:Request,res:Response,next:NextFunction):Promise<Response>,
ConfirmEmail(req:Request,res:Response,next:NextFunction):Promise<Response>,
Login(req:Request,res:Response,next:NextFunction):Promise<Response>,
resendEmailOtp(req:Request,res:Response,next:NextFunction):Promise<Response>,
getuser(req:Request,res:Response,next:NextFunction):Response,
refreshToken(req:Request,res:Response,next:NextFunction):Promise<Response>,
forgetPassword(req:Request,res:Response,next:NextFunction):Promise<Response>,
resetPassword(req:Request,res:Response,next:NextFunction):Promise<Response>,
imageProfile(req:Request,res:Response,next:NextFunction):void
coverImages(req:Request,res:Response,next:NextFunction):void
}


export interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    emailOtp: OtpType;
    passwordOtp:OtpType;
    isCredentialUpdated:Date,
    phone:string,
    isConfirmed:boolean,
    profileImage:string,
    coverImages:string[],
    role:Roles

}



export interface Ipayload{
    id:ObjectId,
    iat:number,
    exp:number,
    jti:string
}
