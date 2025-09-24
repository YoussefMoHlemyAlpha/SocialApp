import {Router} from 'express'
import { UserServices } from './user.services'
import { validation } from '../../middleware/validation.middleware'
import { signUpSchema ,resendOtpSchema, LoginSchema, forgetPasswordSchema, resetPasswordSchema, ConfirmEmailSchema} from './user.validation'
import { auth } from '../../middleware/auth.middleware'
import { uploadFile } from '../../utils/multer/multer'


export const userRouter=Router()
const userservice=new UserServices()


userRouter.post('/sign-up',validation(signUpSchema),userservice.SignUp)

userRouter.post('/confirm-email',validation(ConfirmEmailSchema),userservice.ConfirmEmail)

userRouter.post('/login',validation(LoginSchema),userservice.Login)

userRouter.post('/resend-otp',validation(resendOtpSchema),userservice.resendEmailOtp)

userRouter.post('/refresh-token',userservice.refreshToken)

userRouter.post('/forget-password',validation(forgetPasswordSchema),userservice.forgetPassword)

userRouter.post('/reset-password',validation(resetPasswordSchema),userservice.resetPassword)

userRouter.get('/get-user',auth(),userservice.getuser)

userRouter.patch('/profile-image',uploadFile({}).single('image'),userservice.imageProfile)




