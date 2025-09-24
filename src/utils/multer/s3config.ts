import { S3Client } from "@aws-sdk/client-s3";


export const S3Config=()=>{
    return new S3Client({
        region:process.env.AWS_REGION as string,
        credentials:{
         accessKeyId:process.env.AWS_ACESS_KEY_ID as string,
         secretAccessKey:process.env.AWS_SECRET_ACESS_KEY as string
        }
    })
}