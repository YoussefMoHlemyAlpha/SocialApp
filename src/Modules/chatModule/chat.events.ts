import { AuthentictedSocket } from "../gateway/gateway"
import { chatSocketServices } from "./chat.socket.services"
export class ChatEvents {
    private chatSocketServices = new chatSocketServices()
    constructor() { }
     sendMessage=(socket:AuthentictedSocket)=>{
        socket.on('sendMessage',async(data)=>{
            await this.chatSocketServices.sendMessage(socket,data)
        }
    )
     }

     joinRoom=(socket:AuthentictedSocket)=>{
        socket.on('join_room',async({roomId})=>{
            await this.chatSocketServices.joinRoom(socket,roomId)
        }
    )
    }
}

