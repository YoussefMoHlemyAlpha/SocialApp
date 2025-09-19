import {Router} from 'express'
import { UserServices } from './user.services'
import { validation } from '../../middleware/validation.middleware'
import { signUpSchema ,resendOtpSchema} from './user.validation'

export const userRouter=Router()
const userservice=new UserServices()


userRouter.post('/sign-up',validation(signUpSchema),userservice.SignUp)

userRouter.post('/confirm-email',userservice.ConfirmEmail)

userRouter.post('/login',userservice.Login)

userRouter.post('/resend-otp',validation(resendOtpSchema),userservice.resendEmailOtp)

