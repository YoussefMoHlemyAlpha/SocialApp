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

