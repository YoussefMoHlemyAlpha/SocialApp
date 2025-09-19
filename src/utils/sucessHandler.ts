import { Response } from "express";

export const sucessHandler=({res,msg="Done",status,data}:{res:Response,msg?:string,status:number,data?:Object|null}):Response=>{
    return res.status(status).json({
        msg,
        data
    })
}