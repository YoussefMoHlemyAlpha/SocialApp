import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { HydratedDocument } from "mongoose";
import { IUser } from '../../common/Interfaces/user.interface'
import { decodeToken } from "../../middleware/auth.middleware";
import { TokenTypes } from "../../common/Enums/user.enum";
import { GateWay } from "../chatModule/chat.gatway";
export interface AuthentictedSocket extends Socket {
  user?: HydratedDocument<IUser>
}

export const connectedSockets = new Map<string, string[]>()

export const connect = (socket: AuthentictedSocket, io: Server) => {
  const userId = socket.user?._id.toString() as string
  const currentsockets = connectedSockets.get(userId) || []
  if (currentsockets.length === 0) {
    io.emit('online', { userId: userId, socketId: socket.id })
  }
  currentsockets.push(socket.id)
  connectedSockets.set(userId, currentsockets)
  console.log("connectedSockets", connectedSockets);
}

export const disconnect=(socket:AuthentictedSocket, io: Server)=>{
   socket.on('disconnect', () => {
      const userId = socket.user?._id.toString() as string;
      let currentsockets = connectedSockets.get(userId) || [];

      // Filter out the disconnected socket
      currentsockets = currentsockets.filter((id) => id !== socket.id);

      // Check if the user is now completely offline
      if (currentsockets.length === 0) {
         connectedSockets.delete(userId); 
         // Broadcast that the user is now offline
         io.emit('offline', { userId: userId, socketId: socket.id });
      } else {
         connectedSockets.set(userId, currentsockets);
      }

      console.log("Disconnected", connectedSockets);
   });
}
export const intialize = (httpServer: httpServer) => {
  const chatgateway = new GateWay()
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })




  io.use(async (socket: AuthentictedSocket, next) => {
    const data = await decodeToken({ authorization: socket.handshake.auth.authorization, tokenType: TokenTypes.access });
    socket.user = data.user
    next()
  })


  io.on('connection', (socket: AuthentictedSocket) => {
    chatgateway.register(socket)
    connect(socket, io)
    disconnect(socket,io)
  })
};