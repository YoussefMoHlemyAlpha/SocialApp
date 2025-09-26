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

    constructor(msg:string="user Not Found"){
        super(msg,404)
    }
}


export class NotConfirmed extends ApplicationException{
    constructor(msg:string="Email Not Confirmed"){
        super(msg,403)
    }
}


export class InvalidCredentials extends ApplicationException{
    constructor(msg:string="In-valid Credentials"){
        super(msg,401)
    }
}


export class InvalidOtp extends ApplicationException{
    constructor(msg:string="In-valid otp"){
        super(msg,400)
    }
}


export class InvalidToken extends ApplicationException{
    constructor(msg:string="In-valid token"){
        super(msg,409)
    }
}

export class OTPExpired extends ApplicationException{
    constructor(msg:string="OTP is Expired"){
        super(msg,409)
    }
}

export class UploadFileException extends ApplicationException{
    constructor(msg:string="Upload File failed"){
        super(msg,409)
    }
}

export class preSignedurlException extends ApplicationException{
    constructor(msg:string="Fialed to generate Url"){
        super(msg,409)
    }
}