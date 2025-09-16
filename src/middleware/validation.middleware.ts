import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { validationError } from "../utils/Error";


export const validation=(Schema:ZodObject)=>{
return(req:Request,res:Response,next:NextFunction)=>{
    const data={
        ...req.body,
        ...req.params,
        ...req.query
    }
    const result=Schema.safeParse(data)
    console.log(result);
    
    
    if(!result.success){
        const errors=result.error.issues.map(error=>{
            return `${error.path} => ${error.message}`
        })
       throw new validationError(errors.join(','))
    }
    next()
}
}


