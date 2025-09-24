import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { StoreIn } from "../../common/Enums/user.enum"
import { createReadStream } from "fs"
import { S3Config } from "./s3config"
import { UploadFileException } from "../Error"
import { nanoid } from "nanoid"
import { Upload } from "@aws-sdk/lib-storage"

export const uploadSingleFileS3=async({Bucket=process.env.BUCKET_NAME as string,ACL='private',path='general',file,storeIn=StoreIn.memory}:{Bucket?:string,ACL?:ObjectCannedACL,path?:string,file:Express.Multer.File,storeIn?:StoreIn}):Promise<string>=>{
    const command = new PutObjectCommand({
       Bucket,
       ACL,
       Key:`socailApp/${path}/${nanoid(15)}__${file.originalname}`,
       Body:storeIn==StoreIn.memory ? file.buffer : createReadStream(file.path),
       ContentType:file.mimetype

    })
    await S3Config().send(command)
    if(!command.input.Key){
        throw new UploadFileException()
    }
    return command.input.Key
}

export const uploadSingleLargeFileS3=async({Bucket=process.env.BUCKET_NAME as string,ACL='private',path='general',file,storeIn=StoreIn.memory}:{Bucket?:string,ACL?:ObjectCannedACL,path?:string,file:Express.Multer.File,storeIn?:StoreIn}):Promise<string>=>{
    const upload =new Upload({
        client:S3Config(),
        partSize:10*1024*1024,
        params:{
        Bucket,
       ACL,
       Key:`socailApp/${path}/${nanoid(15)}__${file.originalname}`,
       Body:storeIn==StoreIn.memory ? file.buffer : createReadStream(file.path),
       ContentType:file.mimetype
        }
    })
    upload.on('httpUploadProgress',(process)=>{
        console.log({process});     
    })
    const {Key}=await upload.done()
    if(!Key){
        throw new UploadFileException()
    }
    return Key

}



export const uploadMultipleFiles=async({Bucket=process.env.BUCKET_NAME as string,ACL='private',path='general',files,storeIn=StoreIn.memory}:{Bucket?:string,ACL?:ObjectCannedACL,path?:string,files:Express.Multer.File[],storeIn?:StoreIn}):Promise<string[]>=>{
const Keys=Promise.all(
    storeIn==StoreIn.memory?
    files.map(file=>{
        return uploadSingleFileS3({
            Bucket,
            ACL,
            path,
            file,
            storeIn
        })
    }) :
    files.map(file=>{
        return uploadSingleLargeFileS3({
            Bucket,
            ACL,
            path,
            file,
            storeIn
        })
    })
)
return Keys
}