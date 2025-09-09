import { NextFunction,Request,Response} from "express";
import { ApplicationException } from "../../utils/Error";




interface IUserServices{
sayHello(req:Request,res:Response,next:NextFunction):Response,
getUser(req:Request,res:Response,next:NextFunction):Response
}

export class UserServices implements IUserServices{
    constructor(){}
    sayHello(req: Request, res: Response, next: NextFunction): Response {
        throw new ApplicationException("Error From user",404)
        return res.json({msg:"Hello from user services"})
    }
    getUser(req: Request, res: Response, next: NextFunction): Response {
        return res.json({name:"Youssef",level:"4"})
    }
}