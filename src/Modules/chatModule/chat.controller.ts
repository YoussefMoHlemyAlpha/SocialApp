import { Router } from "express";
import { chatServices} from "./chat.rest.services";
import { auth } from "../../middleware/auth.middleware";
export const chatRouter=Router({
    mergeParams:true
})

const chatService=new chatServices()

export const chatRoutes={
base:'/chat',
getChat:'/'
}
chatRouter.get(chatRoutes.getChat,auth(),chatService.getChat)
export default chatRouter