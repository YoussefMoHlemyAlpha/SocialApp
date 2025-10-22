import { Router } from "express";
import { chatServices} from "./chat.rest.services";

export const chatRouter=Router()

const chatService=new chatServices()

export const chatRoutes={
base:'/chat'
}

export default chatRouter