import { customAlphabet } from "nanoid";
import { EventEmitter } from "events";
import { sendEmail } from "./sendEmail";
import { Template } from "./generatehtml";


export const emailEventEmitter = new EventEmitter();

export const generateOtp = (): string => {
  const nanoid = customAlphabet("1234567890abcdef", 6);
  return nanoid();
};




emailEventEmitter.on('confirmEmail',async({email,firstName,otp})=>{
    console.log("Email sending...........")
  const subject='Confirm email'
  const html=Template(otp,firstName,email)
  await sendEmail({
    to:email,
    html,
    subject
  })
  console.log("email sent");
})


emailEventEmitter.on('resendEmailOtp',async({email,firstName,otp})=>{
    console.log("Email sending...........")
  const subject='resend Otp'
  const html=Template(otp,firstName,email)
  await sendEmail({
    to:email,
    html,
    subject
  })
  console.log("email sent");
})

emailEventEmitter.on('resendPasswordOtp',async({email,firstName,otp})=>{
    console.log("Email sending...........")
  const subject='resend Password Otp'
  const html=Template(otp,firstName,email)
  await sendEmail({
    to:email,
    html,
    subject
  })
  console.log("email sent");
})

emailEventEmitter.on('NotifyTaggedUsers',async({email,firstName,otp})=>{
    console.log("Email sending...........")
  const subject='Notify Tagged Users'
  const html=Template(otp,firstName,email)
  await sendEmail({
    to:email,
    html,
    subject
  })
  console.log("email sent");
})

