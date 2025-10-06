import { z } from "zod";
import { fileTypes } from "./multer/multer";
import { allowComments, availability } from "../common/Enums/post.enum";


export const generalValidation=z.object({

content:z.string().optional(),
files:({type=fileTypes.images,fieldname='attachments'}:{type?:string[],fieldname?:string})=>{
    return z.array(z.object({
        fieldname:z.enum([fieldname]),
        originalname:z.string(),
        encoding:z.string(),
        mimetype:z.enum(type),
        buffer:z.any(),
        path:z.string().optional(),
        size:z.number(),
    })).optional()
},
    availability:z.enum(availability).default(availability.public).optional(),
    allowComments:z.enum(allowComments).default(allowComments.allow).optional(),
    assetFolderId:z.string().optional(),
    tags:z.array(z.string()).optional() 

}
)