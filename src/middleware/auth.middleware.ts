import { TokenTypes } from "../common/Enums/user.enum";
import { Ipayload, IUser } from "../common/Interfaces/user.interface";
import { ApplicationException, InvalidToken, NotConfirmed, NotFoundError, validationError } from "../utils/Error";
import { verifyToken } from "../utils/jwt";
import { UserRepository } from "../DB/Repository/user.repository";
import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";



const userModel = new UserRepository()

export const decodeToken=async({authorization,tokenType=TokenTypes.access}:{authorization?:string|undefined,tokenType?:TokenTypes}):Promise<{user :HydratedDocument<IUser>,payload:Ipayload}> =>{
if(!authorization){
    throw new InvalidToken('in-valid Token')
}
if(!authorization.startsWith(`${process.env.BEARER_KEY} `)){
    throw new InvalidToken('in-valid Token')
}
const token=authorization.split(' ')[1]

if(!token){
    throw new InvalidToken('in-valid Token')
}
const payload=verifyToken({token,signature:tokenType===TokenTypes.access?`${process.env.user_access_signature as string}`:`${process.env.user_refresh_signature as string}`}) as Ipayload
const user = await userModel.findById(payload.id) as HydratedDocument<IUser>;

if(!user){
    throw new NotFoundError('User not found')
}

if(!user.isConfirmed){
    throw new NotConfirmed('Please confirm your email')
}

if(user.isCredentialUpdated.getTime()>=payload.iat*1000){
    throw new validationError('please log-in again')
}
return {user, payload}
}


export const auth =()=>{
return async(req:Request,res:Response,next:NextFunction)=>{
const {user}=await decodeToken({authorization:req.headers.authorization})
res.locals.user=user
next()
}

}


