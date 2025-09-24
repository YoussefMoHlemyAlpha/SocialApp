import { z } from 'zod'
import { ConfirmEmailSchema, forgetPasswordSchema, resendOtpSchema, resetPasswordSchema, signUpSchema } from './user.validation'
import { LoginSchema } from './user.validation'



export type signUpDTO = z.infer<typeof signUpSchema>

export type resendEmailOtpDTO = z.infer<typeof resendOtpSchema>

export type LoginDTO = z.infer<typeof LoginSchema>

export type forgetPasswordDTO=z.infer<typeof forgetPasswordSchema>

export type resetPasswordDTO=z.infer<typeof resetPasswordSchema>

export type confirmEmailDTO=z.infer<typeof ConfirmEmailSchema>