import { NextFunction,Request,Response} from "express";
import { Ipayload, IUser, IUserServices } from "../../common/Interfaces/user.interface";
import { UserRepository } from "../../DB/Repository/user.repository";
import { generateOtp } from "../../utils/emails/emailEvents";
import { emailEventEmitter } from "../../utils/emails/emailEvents";
import { compareText, hashText } from "../../utils/bcrypt";
import jwt from 'jsonwebtoken'
import { nanoid } from "nanoid";
import { confirmEmailDTO, forgetPasswordDTO, LoginDTO, resendEmailOtpDTO, resetPasswordDTO, signUpDTO } from "./user.DTO";
import { InvalidCredentials, InvalidOtp, NotConfirmed, NotFoundError, OTPExpired, validationError } from "../../utils/Error";
import { sucessHandler } from "../../utils/sucessHandler";
import { decodeToken } from "../../middleware/auth.middleware";
import { TokenTypes } from "../../common/Enums/user.enum";
import { uploadSingleLargeFileS3 ,uploadSingleFileS3, uploadMultipleFiles } from "../../utils/multer/s3.services";
import { HydratedDocument } from "mongoose";



export class UserServices implements IUserServices{
    private userRepo = new UserRepository();
    constructor(){}   


    //service to handle user sign up
    SignUp=async (req: Request, res: Response, next: NextFunction):Promise<Response>=>{
      try{
        const{firstName,lastName,email,password,confirmPassword}:signUpDTO=req.body
        const user =await this.userRepo.findByEmail(email)
        if(user){
            return res.status(400).json({msg:"Email already exists"})
        }
        const otp:string=generateOtp()
        await this.userRepo.createOne({data:{firstName,lastName,email,password:hashText(password),confirmPassword:hashText(confirmPassword),emailOtp:{Otp:hashText(otp),expireAt:new Date(Date.now()+10*60*1000)}}});
        //emit event to send email
        emailEventEmitter.emit('confirmEmail', { email, firstName, otp });
        return res.status(201).json({msg:"User created successfully"})
    }catch(error){
console.error(error);
return res.status(500).json({ msg: "Internal server error" });

    }
    }


//service to handle email confirmation
ConfirmEmail=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const{email,otp}:confirmEmailDTO=req.body
    const user=await this.userRepo.findByEmail(email)
    if(!user){
        throw new NotFoundError()
    }
    if(user.emailOtp.expireAt.getTime()<=Date.now()){
        throw new validationError("Otp expired")
    }
    if(!compareText(otp,user.emailOtp.Otp)){
       throw new InvalidOtp()
    }
    user.isConfirmed=true
    user.emailOtp={Otp:"",expireAt:new Date()}
    await user.save()
    return sucessHandler({res,msg:"Email confirmed successfully",status:200})
}

// service to handle user login
Login=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {

    const{email,password}:LoginDTO=req.body
    const user =await this.userRepo.findByEmail(email)
    if(!user){
       throw new NotFoundError()
    }
    if(!user.isConfirmed){
       throw new NotConfirmed()
    }
    if(!compareText(password,user.password)){
        throw new InvalidCredentials()
    }
let accessSignature:string="";
let refreshSignature:string="";

switch(user.role){
    case 'user':
        accessSignature=process.env.user_access_signature as string
        refreshSignature=process.env.user_refresh_signature as string
        break;
    case 'admin':
        accessSignature=process.env.admin_access_signature as string
        refreshSignature=process.env.admin_refresh_signature as string
        break;

}
const jwtid:string=nanoid()
const payload={
    id:user._id,
    email:user.email,
    password:user.password,
    role:user.role,
}
const accessToken:string=jwt.sign(payload,accessSignature,{expiresIn:'15m',jwtid})
const refreshToken:string=jwt.sign(payload,refreshSignature,{expiresIn:'7d',jwtid})

    return sucessHandler({res,msg:"Login successful",status:200,data:{accessToken,refreshToken}})
}


// resend Emaitl Otp service
resendEmailOtp=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
const {email}:resendEmailOtpDTO= req.body;
const user =await this.userRepo.findByEmail(email)
if(!user){
    throw new NotFoundError()
} 

if(user.isConfirmed){
    throw new validationError("Email already confirmed")
}
if(user.emailOtp.expireAt.getTime()>=Date.now()){
    throw new validationError("Otp not expired")
}
const otp:string=generateOtp()
emailEventEmitter.emit('resendEmailOtp', { email, firstName:user.firstName, otp });
user.emailOtp={Otp:hashText(otp),expireAt:new Date(Date.now()+10*60*1000)}
await user.save()
return sucessHandler({res,msg:"Otp resent successfully",status:200})
}

// get user for testing authentication only not actual api 
getuser(req: Request, res: Response, next: NextFunction): Response <IUser>{
    const user=res.locals.user
    return sucessHandler({res,status:200,data:user})
}


refreshToken =async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    
    const authorization=req.headers.authorization
    if(!authorization){
        throw new validationError("in-valid token")
    }
    const {user,payload}:{user:IUser,payload:Ipayload}=await decodeToken({ authorization:authorization, tokenType: TokenTypes.refresh })
    const accessToken:string=jwt.sign({id:user.id},process.env.user_access_signature as string ,{expiresIn:'1h',jwtid:payload.jti})
    return sucessHandler({res,status:200,data:{ accessToken:accessToken}})
}

forgetPassword=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const{email}:forgetPasswordDTO=req.body
    const user =await this.userRepo.findByEmail(email)
    if(!user){
        throw new NotFoundError()
    }
    if(!user.isConfirmed){
        throw new NotConfirmed()
    }
const otp:string=generateOtp()
emailEventEmitter.emit('resendPasswordOtp', { email, firstName:user.firstName, otp })
user.passwordOtp={Otp:hashText(otp),expireAt:new Date(Date.now()+10*60*1000)}
user.isCredentialUpdated=new Date(Date.now())
await user.save()
return sucessHandler({res,msg:"Otp resent successfully",status:200})
}

resetPassword=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const {email,otp,password}:resetPasswordDTO=req.body
    const user = await this.userRepo.findByEmail(email)
    if(!user){
        throw new NotFoundError()
    }
    if(!user.passwordOtp?.Otp){
         throw new validationError(' please user forget password at first')
    }
    if(user.passwordOtp.expireAt.getTime()<=Date.now()){
         throw new OTPExpired()
    }
    if(!compareText(otp,user.passwordOtp.Otp)){
        throw new validationError('in-valid OTP')
    }
await this.userRepo.updateOne({
  filter: { email: user.email},
  updatedData: {
    $set: { password: hashText(password) , isCredentialUpdated:new Date(Date.now())},
    $unset: { passwordOtp: "" }
  }
});

    return sucessHandler({res,status:200,msg:"password is changed sucessfully"})
}

imageProfile=async(req: Request, res: Response, next: NextFunction)=>{
    
    const user=res.locals.user as HydratedDocument<IUser>
    const path=await uploadSingleLargeFileS3({file:req.file as Express.Multer.File ,path:"profileImages"})
    user.profileImage=path
    await user.save()
    sucessHandler({res,data:path,status:200,msg:"Profile Image uploaded successfully"})  
}

coverImages=async(req: Request, res: Response, next: NextFunction)=> {
    const user=res.locals.user as HydratedDocument<IUser>
    const paths=await uploadMultipleFiles({files:req.files as Express.Multer.File[],path:'coverImages'})
    user.coverImages=paths 
    await user.save()
    sucessHandler({res,data:paths,status:200,msg:"Cover Images uploaded successfully"})  
}
}






