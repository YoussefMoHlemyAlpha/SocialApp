import { NextFunction,Request,Response} from "express";
import { IUserServices } from "../../common/Interfaces/user.interface";
import { UserRepository } from "../../DB/Repository/user.repository";
import { generateOtp } from "../../utils/emails/emailEvents";
import { emailEventEmitter } from "../../utils/emails/emailEvents";
import { compareText, hashText } from "../../utils/bcrypt";

export class UserServices implements IUserServices{
    private userRepo = new UserRepository();
    constructor(){}   
    SignUp=async (req: Request, res: Response, next: NextFunction):Promise<Response>=>{
      try{
        const{firstName,lastName,email,password,confirmPassword}:{firstName:string,lastName:string,email:string,password:string,confirmPassword:string}=req.body
        const user =await this.userRepo.findByEmail(email)
        console.log(user)
        if(user){
            return res.status(400).json({msg:"Email already exists"})
        }
        const otp:string=generateOtp()
        await this.userRepo.createOne({data:{firstName,lastName,email,password,confirmPassword,emailOtp:{Otp:hashText(otp),expireAt:new Date(Date.now()+10*60*1000)}}});
        //emit event to send email
        emailEventEmitter.emit('confirmEmail', { email, firstName, otp });
        return res.status(201).json({msg:"User created successfully"})
    }catch(error){
console.error(error);
return res.status(500).json({ msg: "Internal server error" });

    }
    }
ConfirmEmail=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const{email,otp}:{email:string,otp:string}=req.body
    const user=await this.userRepo.findByEmail(email)
    if(!user){
        return res.status(400).json({msg:"Email not found"})
    }
    if(user.emailOtp.expireAt.getTime()<=Date.now()){
        return res.status(400).json({msg:"Otp expired"})
    }
    if(!compareText(otp,user.emailOtp.Otp)){
        return res.status(400).json({msg:"Invalid Otp"})
    }
    user.isConfirmed=true
    await user.save()
    return res.status(200).json({msg:"Email confirmed successfully"})

}


}




