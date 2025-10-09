import { Document, Schema } from "mongoose";
import { allowComments,availability } from "../Enums/post.enum";
import { Request, Response, NextFunction } from "express";

export interface IPostServices{
createPost(req:Request,res:Response,next:NextFunction):Promise<Response>,
LikeandUnlikePost(req:Request,res:Response,next:NextFunction):Promise<Response>,
updatePost(req:Request,res:Response,next:NextFunction):Promise<Response>
}



export interface IPost extends Document{
    content?:string,
    attachments?:string[],
    assetFolderId?:string
    createdBy?: Schema.Types.ObjectId,
    tags?:Schema.Types.ObjectId[],
    likes?:Schema.Types.ObjectId[],
    allowComments?:allowComments,
    availability?:availability,
    deletedAt?:Date,
    deletedBy?:Schema.Types.ObjectId,
    restoredAt?:Date,
    restoredBy?:Schema.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date,
    isDeleted?:boolean

}