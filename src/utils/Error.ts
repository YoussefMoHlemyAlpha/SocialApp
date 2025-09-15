import { string } from "zod"

export class ApplicationException extends Error{
statusCode:number

constructor(msg:string,statuCode:number,options?:ErrorOptions){
super(msg,options)
this.statusCode=statuCode
}
}

export interface IError extends Error{
    statusCode:number
}

export class validationError extends ApplicationException {
    constructor(msg:string){
        super(msg,422)
    }
}