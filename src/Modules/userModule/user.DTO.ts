import { z } from 'zod'
import { resendOtpSchema, signUpSchema } from './user.validation'




export type signUpDTO = z.infer<typeof signUpSchema>

export type resendEmailOtpDTO = z.infer<typeof resendOtpSchema>

