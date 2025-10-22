import { Request, Response, NextFunction } from "express";
import { Document, ObjectId ,Types} from "mongoose";
import { Roles } from "../Enums/user.enum";
import { OtpType } from "../Types/user.type";
import { unknown } from "zod";

export interface IUserServices{
SignUp(req:Request,res:Response,next:NextFunction):Promise<Response>,
ConfirmEmail(req:Request,res:Response,next:NextFunction):Promise<Response>,
Login(req:Request,res:Response,next:NextFunction):Promise<Response>,
resendEmailOtp(req:Request,res:Response,next:NextFunction):Promise<Response>,
getuser(req:Request,res:Response,next:NextFunction):Promise<Response>,
refreshToken(req:Request,res:Response,next:NextFunction):Promise<Response>,
forgetPassword(req:Request,res:Response,next:NextFunction):Promise<Response>,
resetPassword(req:Request,res:Response,next:NextFunction):Promise<Response>,
imageProfile(req:Request,res:Response,next:NextFunction):void,
coverImages(req:Request,res:Response,next:NextFunction):void,
imageProfileWithPreSignedUrl(req:Request,res:Response,next:NextFunction):Promise<Response>,
getandDownloadAttachment(req:Request,res:Response,next:NextFunction):Promise<void>,
getandDownloadAttachmentwithPreSignedUrl(req:Request,res:Response,next:NextFunction):Promise<Response>,
DeleteFile(req:Request,res:Response,next:NextFunction):Promise<Response>,
DeleteFiles(req:Request,res:Response,next:NextFunction):Promise<Response>,
updateEmail(req:Request,res:Response,next:NextFunction):Promise<Response>,
updateEmailConfirm(req:Request,res:Response,next:NextFunction):Promise<Response>,
updatePassword(req:Request,res:Response,next:NextFunction):Promise<Response>,
updatebasicInfo(req:Request,res:Response,next:NextFunction):Promise<Response>,
enbaleTwoStepsVerification(req:Request,res:Response,next:NextFunction):Promise<Response>,
verifyTwostepsOTP(req:Request,res:Response,next:NextFunction):Promise<Response>,
confirmLogin(req:Request,res:Response,next:NextFunction):Promise<Response>,
BlockUser(req:Request,res:Response,next:NextFunction):Promise<Response>,
sendRequest(req:Request,res:Response,next:NextFunction):Promise<Response>,
deleteRequest(req:Request,res:Response,next:NextFunction):Promise<Response>,
unFriend(req:Request,res:Response,next:NextFunction):Promise<Response>,
acceptRequest(req:Request,res:Response,next:NextFunction):Promise<Response>,
deleteUser(req:Request,res:Response,next:NextFunction):Promise<Response>,
}


export interface IUser extends Document{
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    slug:string,
    password: string;
    confirmPassword: string;
    emailOtp: OtpType;
    newEmail:string,
    newEmailOtp:OtpType ,
    passwordOtp:OtpType,
    twoStepVerification:OtpType,
    isCredentialUpdated:Date,
    twoStepVerficationState:boolean,
    phone:string,
    enTSV:boolean,
    isConfirmed:boolean,
    blockUsers:Types.ObjectId[],
    profileImage:string,
    coverImages:string[],
    oldpasswords:string[],
    Key:string,
    role:Roles,
    deleteAt?:Date,
    extra:{
        name:string
    }
    friends:Types.ObjectId[],
    friendRequests:Types.ObjectId[]

}



export interface Ipayload{
    id:ObjectId,
    iat:number,
    exp:number,
    jti:string
}


