import { AuthentictedSocket } from "../gateway/gateway"
import { chatSocketServices } from "./chat.socket.services"
export class ChatEvents {
    private chatSocketServices = new chatSocketServices()
    constructor() { }
    sayHi = (socket: AuthentictedSocket) => {

        socket.on('sayHi', (message: string, callback: Function) => {
         return  this.chatSocketServices.sayHi(message, callback)
        })
            
        }

    }

