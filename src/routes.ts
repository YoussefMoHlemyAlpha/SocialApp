import {Router} from "express"
import { userRouter } from "./Modules/userModule"
import { postRouter } from "./Modules/postModule"

export const baseRouter=Router()

baseRouter.use('/user',userRouter)

baseRouter.use('/post',postRouter)

