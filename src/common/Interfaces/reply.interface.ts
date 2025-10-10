import { Document,Schema,Types } from "mongoose"
import { Request,Response,NextFunction } from "express"



export interface IReplyServices {
    createReply(req:Request,res:Response,next:NextFunction):Promise<Response>,
}



export interface IReply extends Document{
    content?:string,
    attachments?:string[],
    assetFolderId?:string,
    commentId:Schema.Types.ObjectId,
    postId:Schema.Types.ObjectId,
    createdBy?: Schema.Types.ObjectId,
    tags?:Schema.Types.ObjectId[],
    deletedAt?:Date,
    deletedBy?:Schema.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date,
    isDeleted?:boolean,
}