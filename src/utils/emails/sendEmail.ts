import nodemailer from 'nodemailer';


export const sendEmail=async({to,subject,html}:{to:string,subject:string,html:string})=> {

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
})

const main =async()=>{
const info=await transporter.sendMail({
    from:`SocialApp "<${process.env.user}>"`,
    to,
    subject,
    html
})

}
main().catch((err)=>{


})
}



