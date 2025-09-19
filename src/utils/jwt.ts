import { JwtPayload, verify } from "jsonwebtoken";

export const verifyToken=({token,signature}:{token:string,signature:string}):JwtPayload=>{
const payload=verify(token,signature) as JwtPayload
return payload
}
