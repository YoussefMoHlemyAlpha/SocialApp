import { DeleteObjectCommand, DeleteObjectCommandOutput, DeleteObjectsCommand, GetObjectAclCommand, GetObjectCommand, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { StoreIn } from "../../common/Enums/user.enum"
import { createReadStream } from "fs"
import { S3Config } from "./s3config"
import { preSignedurlException, UploadFileException } from "../Error"
import { nanoid } from "nanoid"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Key } from "readline"
import { object } from "zod"

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




export const createPreSignedUrl=async({Bucket=process.env.BuCKET_NAME as string ,path="general",ContentType,originalname,expiresIn=120}:{Bucket?:string,path?:string,ContentType:string,originalname:string,expiresIn?:number})=>{
const command= new PutObjectCommand({
    Bucket,
    Key:`socailApp/${path}/${nanoid(15)}__PreSignedUrl__${originalname}`,
    ContentType
})
const url=await getSignedUrl(S3Config(),command,{
    expiresIn,

})
if(!url || !command?.input?.Key){
    throw new preSignedurlException()
}
return {Key:command.input.Key,url}
}


export const getFile=async({Bucket=process.env.BuCKET_NAME as string,Key}:{Bucket?:string,Key:string})=>{
    const command=new GetObjectCommand({Bucket,Key})
    return await S3Config().send(command)
}


export const CreateGetPreSignedUrl=async({Bucket=process.env.BuCKET_NAME as string,Key,download='false',downloadName="dummy",expiresIn=120}:{Bucket?:string,Key:string,download?:string,downloadName?:string,expiresIn?:number})=>{
const command= new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition:
    download==="true" ? `attachment; filename=${downloadName}` : undefined
})
const url= await getSignedUrl(S3Config(),command,{expiresIn})
if(!url){
    throw new preSignedurlException()
}
return url

}

export const deleteFile=async({Bucket=process.env.BuCKET_NAME as string,Key}:{Bucket?:string,Key:string}):Promise<DeleteObjectCommandOutput>=>{
const command= new DeleteObjectCommand({
    Bucket,
    Key
})
return await S3Config().send(command)
}


export const deleteFiles=async({Bucket=process.env.BuCKET_NAME as string,urls,Quiet=false}:{Bucket?:string,urls:string[],Quiet?:boolean}):Promise<DeleteObjectCommandOutput>=>{
const Objects=urls.map((url)=>{
   return{Key:url}
})   
const command= new DeleteObjectsCommand({
    Bucket,
    Delete:{
        Objects,
        Quiet
    }
})
return await S3Config().send(command)
}