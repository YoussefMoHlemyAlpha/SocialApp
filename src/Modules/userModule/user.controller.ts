import {Router} from 'express'
import { UserServices } from './user.services'
import { validation } from '../../middleware/validation.middleware'
import { signUpSchema ,resendOtpSchema, LoginSchema, forgetPasswordSchema, resetPasswordSchema, ConfirmEmailSchema, updateEmailSchema, ConfirmupdateEmailSchema, updatePasswordSchema, updateBasicInfoSchema, verifyTwostepsSechema, confirmLoginSchema} from './user.validation'
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

userRouter.patch('/profile-image',auth(),uploadFile({}).single('image'),userservice.imageProfile)

userRouter.patch('/cover-images',auth(),uploadFile({}).array('images',5),userservice.coverImages)

userRouter.patch('/profile-image',auth(),userservice.imageProfileWithPreSignedUrl)

userRouter.get('/upload/*path',userservice.getandDownloadAttachment)

userRouter.get('/getordownloadfile',userservice.getandDownloadAttachment)

userRouter.get('/getordownloadfileWithpresign',userservice.getandDownloadAttachmentwithPreSignedUrl)

userRouter.delete('/delete-file',userservice.DeleteFile)

userRouter.patch('/update-email',auth(),validation(updateEmailSchema),userservice.updateEmail)

userRouter.patch('/confirm-update-email',validation(ConfirmupdateEmailSchema),userservice.updateEmailConfirm)

userRouter.patch('/update-password',validation(updatePasswordSchema),userservice.updatePassword)

userRouter.patch('/update-info',auth(),validation(updateBasicInfoSchema),userservice.updatebasicInfo)

userRouter.post('/en-2fv',auth(),userservice.enbaleTwoStepsVerification)

userRouter.post('/verify-otp',auth(),validation(verifyTwostepsSechema),userservice.verifyTwostepsOTP)

userRouter.post('/confirm-login',validation(confirmLoginSchema),userservice.confirmLogin)