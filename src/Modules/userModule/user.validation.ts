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