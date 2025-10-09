import {Router} from "express"
import { userRouter } from "./Modules/userModule"
import { postRouter } from "./Modules/postModule"
import { CommentRouter } from "./Modules/CommentModule/comment.controller"
import { ReplyRouter } from "./Modules/ReplyModule/reply.controller"

export const baseRouter=Router()

baseRouter.use('/user',userRouter)

baseRouter.use('/post',postRouter)

baseRouter.use('/comment',CommentRouter)

baseRouter.use('/reply',ReplyRouter)

