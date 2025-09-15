import {Router} from 'express'
import { UserServices } from './user.services'
import { validation } from '../../middleware/validation.middleware'
import { signUpSchema } from './user.validation'

export const userRouter=Router()
const userservice=new UserServices()

userRouter.get('/',(req,res,next)=>{
    res.json({msg:"Hello from user Router"})
})

userRouter.post('/sign-up',validation(signUpSchema),userservice.SignUp)


