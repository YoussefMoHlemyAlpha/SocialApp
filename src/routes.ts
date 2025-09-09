import {Router} from "express"
import { userRouter } from "./Modules/userModule/user.controller"

export const baseRouter=Router()

baseRouter.use('/user',userRouter)

