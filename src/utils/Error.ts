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

export class NotFoundError extends ApplicationException {

    constructor(msg:string){
        super(msg,404)
    }
}


export class NotConfirmed extends ApplicationException{
    constructor(msg:string){
        super(msg,403)
    }
}


export class InvalidCredentials extends ApplicationException{
    constructor(msg:string){
        super(msg,401)
    }
}


export class InvalidOtp extends ApplicationException{
    constructor(msg:string){
        super(msg,400)
    }
}