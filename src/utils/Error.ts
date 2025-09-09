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