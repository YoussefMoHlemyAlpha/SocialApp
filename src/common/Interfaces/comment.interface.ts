import { Document,Schema,Types } from "mongoose"
import { Request,Response,NextFunction } from "express"

export interface ICommentServices {
    createComment(req:Request,res:Response,next:NextFunction):Promise<Response>,
    updateComment(req:Request,res:Response,next:NextFunction):Promise<Response>,
    getCommentById(req:Request,res:Response,next:NextFunction):Promise<Response>,
    getCommentWithReply(req:Request,res:Response,next:NextFunction):Promise<Response>,
    deleteComment(req:Request,res:Response,next:NextFunction):Promise<Response>,
    freezeComment(req:Request,res:Response,next:NextFunction):Promise<Response>,
}

export interface IComment extends Document{
    content?:string,
    attachments?:string[],
    postId?:Schema.Types.ObjectId,
    assetFolderId?:string,
    createdBy?: Types.ObjectId,
    tags?:Schema.Types.ObjectId[],
    deletedAt?:Date,
    deletedBy?:Schema.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date,
    isDeleted?:boolean,
    isfreezed?:boolean
}