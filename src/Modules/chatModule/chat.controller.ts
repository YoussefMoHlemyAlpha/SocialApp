import { Router } from "express";
import { chatServices} from "./chat.rest.services";
import { auth } from "../../middleware/auth.middleware";
import { validation } from "../../middleware/validation.middleware";
import { createGroupSchema } from "./chat.validation";


export const chatRouter=Router({
    mergeParams:true
})

const chatService=new chatServices()

export const chatRoutes={
base:'/chat',
getChat:'/',
createGroup:'/create-group',
getGroupChat:'/get-group-chat/:id'
}
chatRouter.get(chatRoutes.getChat,auth(),chatService.getChat)

chatRouter.post(chatRoutes.createGroup,auth(),validation(createGroupSchema),chatService.createGroup)

chatRouter.get(chatRoutes.getGroupChat,auth(),chatService.getGroupChat)

export default chatRouter