import { z } from 'zod'
import { ConfirmEmailSchema, confirmLoginSchema, ConfirmupdateEmailSchema, forgetPasswordSchema, resendOtpSchema, resetPasswordSchema, signUpSchema, updateBasicInfoSchema, updateEmailSchema, updatePasswordSchema, verifyTwostepsSechema } from './user.validation'
import { LoginSchema } from './user.validation'



export type signUpDTO = z.infer<typeof signUpSchema>

export type resendEmailOtpDTO = z.infer<typeof resendOtpSchema>

export type LoginDTO = z.infer<typeof LoginSchema>

export type forgetPasswordDTO=z.infer<typeof forgetPasswordSchema>

export type resetPasswordDTO=z.infer<typeof resetPasswordSchema>

export type confirmEmailDTO=z.infer<typeof ConfirmEmailSchema>

export type updateEmailDTO=z.infer<typeof updateEmailSchema>

export type ConfirmupdateEmailDTO=z.infer<typeof ConfirmupdateEmailSchema>

export type updatePasswordDTO=z.infer<typeof updatePasswordSchema>

export type updateBasicInfoDTO=z.infer<typeof updateBasicInfoSchema>

export type twoStepVerificationDTO=z.infer<typeof verifyTwostepsSechema>

export type confirmLoginDTO=z.infer<typeof confirmLoginSchema>

