import {Router} from "express"
import { userRouter } from "./Modules/userModule/user.controller"
import { postRouter } from "./Modules/postModule/post.controller"

export const baseRouter=Router()

baseRouter.use('/user',userRouter)

baseRouter.use('/post',postRouter)

