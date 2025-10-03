import { NextFunction,Request,Response} from "express";
import { Ipayload, IUser, IUserServices } from "../../common/Interfaces/user.interface";
import { UserRepository } from "../../DB/Repository/user.repository";
import { generateOtp } from "../../utils/emails/emailEvents";
import { emailEventEmitter } from "../../utils/emails/emailEvents";
import { compareText, hashText } from "../../utils/bcrypt";
import jwt from 'jsonwebtoken'
import { nanoid } from "nanoid";
import { confirmEmailDTO, confirmLoginDTO, ConfirmupdateEmailDTO, forgetPasswordDTO, LoginDTO, resendEmailOtpDTO, resetPasswordDTO, signUpDTO, twoStepVerificationDTO, updateBasicInfoDTO, updateEmailDTO, updatePasswordDTO } from "./user.DTO";
import { ApplicationException, InvalidCredentials, InvalidOtp, NotConfirmed, NotFoundError, OTPExpired, preSignedurlException, unusedEmail, unusedPassword, validationError } from "../../utils/Error";
import { sucessHandler } from "../../utils/sucessHandler";
import { decodeToken } from "../../middleware/auth.middleware";
import { TokenTypes } from "../../common/Enums/user.enum";
import { uploadSingleLargeFileS3 ,uploadSingleFileS3, uploadMultipleFiles, createPreSignedUrl, getFile,CreateGetPreSignedUrl, deleteFile, deleteFiles } from "../../utils/multer/s3.services";
import { HydratedDocument } from "mongoose";
import { promisify } from "util";
import { pipeline } from "stream";


const createS3WriteStreamPipe=promisify(pipeline)

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
if(!user.enTSV){
    return sucessHandler({res,msg:"Login successful",status:200,data:{accessToken,refreshToken}})
}
const otp:string=generateOtp()
emailEventEmitter.emit('resendEmailOtp', { email, firstName:user.firstName, otp });
user.twoStepVerification={Otp:hashText(otp),expireAt:new Date(Date.now()+10*60*1000)}
await user.save()
return sucessHandler({res,msg:"OTP sent to your email",status:200})
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

imageProfileWithPreSignedUrl=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const user=res.locals.user as HydratedDocument<IUser>
    const{originalname,ContentType}:{originalname:string,ContentType:string}=req.body
    const{Key,url}=await createPreSignedUrl({originalname,ContentType,path:`profileImages`})
    user.Key=Key
    await user.save()
    return sucessHandler({res,data:{Key,url},status:200,msg:"Cover Images uploaded successfully"})  
    
}

getandDownloadAttachment=async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
   const{downloadName}=req.query
   const{path}=req.params as unknown as {path:string[]}
   const Key=path.join('/')
   const s3Response= await getFile({Key})
   if(!s3Response?.Body){
    throw new ApplicationException('failed to get File !',409)
   }
   res.setHeader('Content-Type',`${s3Response.ContentType}`||'application/octet-stream')
   if(downloadName){
    res.setHeader('Content-Disposition',`attachment; filename=${downloadName}`)
   }
   return  createS3WriteStreamPipe(s3Response.Body as NodeJS.ReadableStream,res)
}
getandDownloadAttachmentwithPreSignedUrl=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
   const{downloadName,download}=req.query
   const{path}=req.params as unknown as {path:string[]}
   const Key=path.join('/')
   const url= await CreateGetPreSignedUrl({Key,downloadName:downloadName as string,download:download as string})
   return sucessHandler({res,data:{url},status:200,msg:"Done"})  
}
DeleteFile=async(req: Request, res: Response, next: NextFunction): Promise<Response>=> {
    const{Key}=req.query as {Key:string}
    const results=await  deleteFile({Key:Key as string})
    return sucessHandler({res,data:results,status:200,msg:"Done"})  


}
DeleteFiles=async(req: Request, res: Response, next: NextFunction): Promise<Response>=>{
const { urls } = req.body;

if (!Array.isArray(urls) || urls.length === 0) {

return res.status(400).json({
        success: false,
        message: "urls must be a non-empty array of strings",
      });
      
}
const results=await  deleteFiles({urls})
return sucessHandler({res,data:results,status:200,msg:"Done"})  
}

updateEmail=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const {newEmail}:updateEmailDTO =req.body
    const user=res.locals.user as HydratedDocument<IUser>
    console.log({user})
    if(newEmail==user.email){
        throw new unusedEmail()
    }
    const ExistUser=await this.userRepo.findByEmail(newEmail)
    if(ExistUser){
        throw new ApplicationException('please use another Email',409)
    }
    if(!user.isConfirmed){
        throw new NotConfirmed()
    }
    const oldEmailOtp:string=generateOtp()
    user.emailOtp={Otp:hashText(oldEmailOtp),expireAt:new Date(Date.now()+60*1000)}
    emailEventEmitter.emit('confirmEmail', { email:user.email, firstName:user.firstName, otp:oldEmailOtp });

    const newEmailOtp:string=generateOtp()
    user.newEmailOtp={Otp:hashText(newEmailOtp),expireAt:new Date(Date.now()+60*1000)}

    user.newEmail=newEmail
    user.isConfirmed=false

    emailEventEmitter.emit('confirmEmail', { email:user.newEmail, firstName:user.firstName, otp:newEmailOtp });
    await user.save()
   return sucessHandler({res,status:200,msg:"Done"})  
    
}
updateEmailConfirm=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const {email,emailOtp,newEmailOtp}:ConfirmupdateEmailDTO=req.body
    const user=await this.userRepo.findByEmail(email)
    if(!user){
        throw new NotFoundError()
    }
    if(user.emailOtp?.expireAt.getTime()<=Date.now()||user.newEmailOtp?.expireAt.getTime()<=Date.now()){
     throw new OTPExpired()
    }
    if(!compareText(emailOtp,user.emailOtp.Otp)||!compareText(newEmailOtp,user.newEmailOtp.Otp)){
     throw new validationError('in-valid OTP')
    }
    user.email=user.newEmail
    user.isConfirmed=true
    user.emailOtp={ Otp: "", expireAt: new Date() }
    user.newEmail=""
    user.newEmailOtp={ Otp: "", expireAt: new Date() }
    await user.save()

    return sucessHandler({res,data:{user},status:200,msg:"Email Updated Successfully"})
}

updatePassword=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
   const {email,oldPassword,newPassword}:updatePasswordDTO=req.body
   const user=await this.userRepo.findByEmail(email)
   if(!user){
    throw new NotFoundError()
   }
   if(!compareText(oldPassword,user.password)){
    throw new validationError('incorrect Password')
   }
   if(compareText(newPassword,user.password)){
    throw new unusedPassword()
   }
   for (const old of user.oldpasswords || []) {
    if(compareText(newPassword,old)){
        throw new unusedPassword()
    }
   }
   user.oldpasswords.push(user.password)
   user.password=hashText(newPassword)
   user.isCredentialUpdated=new Date(Date.now())
    await user.save()
    return sucessHandler({res,data:{user},status:200,msg:"Password Updated Successfully"})
}
updatebasicInfo=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const {firstName,lastName,phone}:updateBasicInfoDTO=req.body
    const user=res.locals.user as HydratedDocument<IUser>
    const isExist = await this.userRepo.findByEmail(user.email);
    if(!isExist){
        throw new NotFoundError()
    }
    if(!user.isConfirmed){
        throw new NotConfirmed()
    }
if(firstName!==undefined) user.firstName=firstName
if(lastName!==undefined) user.lastName=lastName
if(phone!==undefined) user.phone=phone

await user.save()
return sucessHandler({res,data:{user},status:200,msg:"Basic Info Updated Successfully"})

}

enbaleTwoStepsVerification=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const user=res.locals.user as HydratedDocument<IUser>
    const isExist=await this.userRepo.findByEmail(user.email)
    if(!isExist){
        throw new NotFoundError()
    }
    if(!user.isConfirmed){
        throw new NotFoundError()
    }
    if(user.twoStepVerification?.expireAt?.getTime()>=Date.now()){
     throw new ApplicationException('otp is not expired',409)
    }
const otp:string=generateOtp()
emailEventEmitter.emit('resendEmailOtp', { email:user.email, firstName:user.firstName, otp });
user.twoStepVerification={Otp:hashText(otp),expireAt:new Date(Date.now()+10*60*1000)}
await user.save()
return sucessHandler({res,status:200,msg:'OTP sent to your email'})
}
verifyTwostepsOTP=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const{otp}:twoStepVerificationDTO=req.body
    const user=res.locals.user as HydratedDocument<IUser>
    const isExist=await this.userRepo.findByEmail(user.email)
    if(!isExist){
        throw new NotFoundError()
    }
    if(!user.isConfirmed){
        throw new NotFoundError()
    }
    if(user.twoStepVerification?.expireAt?.getTime()<=Date.now()){
        throw new OTPExpired()
    }
    if(!compareText(otp,user.twoStepVerification?.Otp)){
        throw new ApplicationException('Wrong OTP',409)
    }
    user.enTSV=true
    await user.save()
    return sucessHandler({res,status:200,msg:"2FA enabled successfully"})
}

confirmLogin=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const{otp,email}:confirmLoginDTO=req.body
    const user=await this.userRepo.findByEmail(email)
    console.log({user})
    if(!user){
        throw new NotFoundError()
    }
    if(!user.isConfirmed){
        throw new NotFoundError()
    }
    if(!user.enTSV){
        throw new ApplicationException('TWO Steps Verification disabled',409)
    }
    if(user.twoStepVerification?.expireAt?.getTime()<=Date.now()){
        throw new validationError("Otp expired")
    }
    if(!compareText(otp,user.twoStepVerification?.Otp)){
        throw new ApplicationException('Wrong OTP',409)
    }
    user.twoStepVerficationState=true
    await user.save()
    return sucessHandler({res,status:200,msg:"TWO Steps Verification is DONE"})
}
}






