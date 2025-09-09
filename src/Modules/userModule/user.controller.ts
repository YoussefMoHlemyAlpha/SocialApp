import {Router} from 'express'
import { UserServices } from './user.services'

export const userRouter=Router()
const userservice=new UserServices()

userRouter.get('/',(req,res,next)=>{
    res.json({msg:"Hello from user Router"})
})

userRouter.get('/sayhello',userservice.sayHello)
userRouter.get('/getuser',userservice.getUser)

