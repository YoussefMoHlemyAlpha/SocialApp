import { AuthentictedSocket } from "../gateway/gateway"
import { ChatEvents } from "./chat.events"

export class GateWay {
    private chatEvents = new ChatEvents()
    constructor() { }
    register(socket: AuthentictedSocket) {
        this.chatEvents.sendMessage(socket)
        this.chatEvents.joinRoom(socket)
    }
}