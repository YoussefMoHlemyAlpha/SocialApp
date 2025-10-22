import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { HydratedDocument } from "mongoose";
import {IUser} from '../../common/Interfaces/user.interface'
import { decodeToken } from "../../middleware/auth.middleware";
import { TokenTypes } from "../../common/Enums/user.enum";
import { GateWay } from "../chatModule/chat.gatway";
  export interface AuthentictedSocket extends Socket{
    user?: HydratedDocument<IUser>
  }

  export const connectedSockets=new Map<string,string[]>()

export const connect=(socket:AuthentictedSocket)=>{
   const currentsockets=connectedSockets.get(socket.user?.id.toString()  as string)||[]
   currentsockets.push(socket.id)
   connectedSockets.set(socket.user?.id.toString() as string,currentsockets)
   console.log("connectedSockets",connectedSockets);
}
export const disconnect=(socket:AuthentictedSocket)=>{
   socket.on('disconnect',()=>{
   let currentsockets=connectedSockets.get(socket.user?._id.toString()  as string)||[]
    currentsockets=currentsockets.filter((id)=>{
      return id!==socket.id
   })
    connectedSockets.set(socket.user?._id.toString() as string,currentsockets)
    console.log("Disconnected",connectedSockets);
   })
}
export const intialize=(httpServer:httpServer)=>{
const chatgateway=new GateWay()
const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })




  io.use(async(socket:AuthentictedSocket, next)=>{
    const data=await decodeToken({authorization:socket.handshake.auth.authorization,tokenType:TokenTypes.access});
    socket.user=data.user
    next()
  })
  

  io.on('connection', (socket: AuthentictedSocket) => {
  chatgateway.register(socket)
   connect(socket)
   disconnect(socket)
  })};