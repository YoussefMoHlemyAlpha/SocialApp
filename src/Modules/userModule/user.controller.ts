import {Router} from 'express'
import { UserServices } from './user.services'
import { validation } from '../../middleware/validation.middleware'
import { signUpSchema ,resendOtpSchema, LoginSchema, forgetPasswordSchema, resetPasswordSchema, ConfirmEmailSchema, updateEmailSchema, ConfirmupdateEmailSchema, updatePasswordSchema, updateBasicInfoSchema, verifyTwostepsSechema, confirmLoginSchema} from './user.validation'
import { auth } from '../../middleware/auth.middleware'
import { uploadFile } from '../../utils/multer/multer'

export const userRouter=Router()
const userservice=new UserServices()

const userRoutes={
    signUp:'/sign-up',
    confirmEmail:'/confirm-email',
    login:'/login',
    resendOtp:'/resend-otp',
    refreshToken:'/refresh-token',
    forgetPassword:'/forget-password',
    resetPassword:'/reset-password',
    getuser:'/get-user',
    profileImage:'/profile-image',
    coverImages:'/cover-images',
    imageProfileWithPreSignedUrl:'/profile-image-presign',
    getandDownloadAttachment:'/getordownloadfile',
    getandDownloadAttachmentwithPreSignedUrl:'/getordownloadfileWithpresign',
    deleteFile:'/delete-file',
    updateEmail:'/update-email',
    confirmUpdateEmail:'/confirm-update-email',
    updatePassword:'/update-password',
    updateInfo:'/update-info',
    en2fv:'/en-2fv',
    verifyOtp:'/verify-otp',
    confirmLogin:'/confirm-login',
    blockuser:'/block/:id'
}

userRouter.post(userRoutes.signUp,validation(signUpSchema),userservice.SignUp)

userRouter.post(userRoutes.confirmEmail,validation(ConfirmEmailSchema),userservice.ConfirmEmail)

userRouter.post(userRoutes.login,validation(LoginSchema),userservice.Login)

userRouter.post(userRoutes.resendOtp,validation(resendOtpSchema),userservice.resendEmailOtp)

userRouter.post(userRoutes.refreshToken,userservice.refreshToken)

userRouter.post(userRoutes.forgetPassword,validation(forgetPasswordSchema),userservice.forgetPassword)

userRouter.post(userRoutes.resetPassword,validation(resetPasswordSchema),userservice.resetPassword)

userRouter.get(userRoutes.getuser,auth(),userservice.getuser)

userRouter.patch(userRoutes.profileImage,auth(),uploadFile({}).single('image'),userservice.imageProfile)

userRouter.patch(userRoutes.coverImages,auth(),uploadFile({}).array('images',5),userservice.coverImages)

userRouter.patch(userRoutes.imageProfileWithPreSignedUrl,auth(),userservice.imageProfileWithPreSignedUrl)

userRouter.get(userRoutes.getandDownloadAttachment,userservice.getandDownloadAttachment)

userRouter.get(userRoutes.getandDownloadAttachmentwithPreSignedUrl,userservice.getandDownloadAttachmentwithPreSignedUrl)

userRouter.delete(userRoutes.deleteFile,userservice.DeleteFile)

userRouter.patch(userRoutes.updateEmail,auth(),validation(updateEmailSchema),userservice.updateEmail)

userRouter.patch(userRoutes.confirmUpdateEmail,validation(ConfirmupdateEmailSchema),userservice.updateEmailConfirm)

userRouter.patch(userRoutes.updatePassword,validation(updatePasswordSchema),userservice.updatePassword)

userRouter.patch(userRoutes.updateInfo,auth(),validation(updateBasicInfoSchema),userservice.updatebasicInfo)

userRouter.post(userRoutes.en2fv,auth(),userservice.enbaleTwoStepsVerification)

userRouter.post(userRoutes.verifyOtp,auth(),validation(verifyTwostepsSechema),userservice.verifyTwostepsOTP)

userRouter.post(userRoutes.confirmLogin,validation(confirmLoginSchema),userservice.confirmLogin)

userRouter.post(userRoutes.blockuser,auth(),userservice.BlockUser)
