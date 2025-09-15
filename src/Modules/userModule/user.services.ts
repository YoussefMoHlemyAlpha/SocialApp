import { NextFunction,Request,Response} from "express";
import { ApplicationException } from "../../utils/Error";
import { signUpSchema } from "./user.validation";




interface IUserServices{
SignUp(req:Request,res:Response,next:NextFunction):Promise<Response>,

}

export class UserServices implements IUserServices{
    constructor(){}   


    async SignUp(req: Request, res: Response, next: NextFunction):Promise<Response>{
        const{name,email,password,confirmPassword}=req.body
        
        return res.json({ msg: "Done"})
    }

}