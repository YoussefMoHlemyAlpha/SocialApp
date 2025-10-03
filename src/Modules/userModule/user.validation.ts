import { isOptionalChain } from 'typescript'
import z from 'zod'

export const signUpSchema=z.object({
    firstName:z.string().min(3).max(20),
    lastName:z.string().min(3).max(20),
    password:z.string().min(4).max(20),
    email:z.email(),
    confirmPassword:z.string().min(4).max(20),
}).superRefine((args,ctx)=>{
    if(args.password != args.confirmPassword){
        ctx.addIssue({
            code:"custom",
            path:["Confirm Password"],
            message:"Confirm Password must be equal to Password"
        })
    }
})


export const resendOtpSchema=z.object({
    email:z.email()
})

export const LoginSchema=z.object({
    email:z.email(),
    password:z.string().min(4).max(20)
})


export const forgetPasswordSchema=z.object({
    email:z.email()
})


export const resetPasswordSchema=z.object({
    email:z.email(),
    otp:z.string(),
    password:z.string().min(4).max(20)

})


export const ConfirmEmailSchema=z.object({
    email:z.email(),
    otp:z.string()
})

export const updateEmailSchema=z.object({
    newEmail:z.email(),
})

export const ConfirmupdateEmailSchema=z.object({
    email:z.email(),
    emailOtp:z.string(),
    newEmailOtp:z.string()
})


export const updatePasswordSchema=z.object({
    email:z.email(),
    oldPassword:z.string(),
    newPassword:z.string()
})

export const updateBasicInfoSchema=z.object({
    

firstName:z.string().optional(),    
lastName:z.string().optional(),
phone:z.string().optional()

})


export const verifyTwostepsSechema=z.object({
    
otp:z.string()


})


export const confirmLoginSchema=z.object({
    
otp:z.string(),
email:z.email()

})

