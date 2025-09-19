import e, { NextFunction,Request,Response} from "express";
import { IUserServices } from "../../common/Interfaces/user.interface";
import { UserRepository } from "../../DB/Repository/user.repository";
import { generateOtp } from "../../utils/emails/emailEvents";
import { emailEventEmitter } from "../../utils/emails/emailEvents";
import { compareText, hashText } from "../../utils/bcrypt";
import jwt from 'jsonwebtoken'
import { nanoid } from "nanoid";
import { resendEmailOtpDTO, signUpDTO } from "./user.DTO";
import { InvalidCredentials, InvalidOtp, NotConfirmed, NotFoundError, validationError } from "../../utils/Error";
import { sucessHandler } from "../../utils/sucessHandler";

export class UserServices implements IUserServices{
    private userRepo = new UserRepository();
    constructor(){}   


    //service to handle user sign up
    SignUp=async (req: Request, res: Response, next: NextFunction):Promise<Response>=>{
      try{
        const{firstName,lastName,email,password,confirmPassword}:signUpDTO=req.body
        const user =await this.userRepo.findByEmail(email)
        console.log(user)
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
    const{email,otp}:{email:string,otp:string}=req.body
    const user=await this.userRepo.findByEmail(email)
    if(!user){
        throw new NotFoundError("User not found")
    }
    if(user.emailOtp.expireAt.getTime()<=Date.now()){
        throw new validationError("Otp expired")
    }
    if(!compareText(otp,user.emailOtp.Otp)){
       throw new InvalidOtp("Invalid Otp")
    }
    user.isConfirmed=true
    user.emailOtp={Otp:"",expireAt:new Date()}
    await user.save()
    return sucessHandler({res,msg:"Email confirmed successfully",status:200})
}

// service to handle user login
Login=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {

    const{email,password}:{email:string,password:string}=req.body
    const user =await this.userRepo.findByEmail(email)
    if(!user){
       throw new NotFoundError("User not found")
    }
    if(!user.isConfirmed){
       throw new NotConfirmed("Please confirm your email first")
    }
    if(!compareText(password,user.password)){
        throw new InvalidCredentials("Invalid credentials")
    }
let accessSignature:string="";
let refreshSignature:string="";

switch(user.role){
    case 'user':
        accessSignature=process.env.user_acess_signature as string
        refreshSignature=process.env.user_refresh_signature as string
        break;
    case 'admin':
        accessSignature=process.env.admin_acess_signature as string
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



resendEmailOtp=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
const {email}:resendEmailOtpDTO= req.body;
const user =await this.userRepo.findByEmail(email)
if(!user){
    throw new NotFoundError("User not found")
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
}


