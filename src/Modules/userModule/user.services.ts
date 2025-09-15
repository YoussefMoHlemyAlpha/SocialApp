import { NextFunction,Request,Response} from "express";
import { IUserServices } from "../../common/Interfaces/user.interface";
import { UserRepository } from "../../DB/Repository/user.repository";



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
        await this.userRepo.createOne({data:{firstName,lastName,email,password,confirmPassword}});
        return res.status(201).json({msg:"User created successfully"})
    }catch(error){
console.error(error);
return res.status(500).json({ msg: "Internal server error" });

    }
    }
}