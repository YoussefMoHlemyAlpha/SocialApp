import { Document,Schema } from "mongoose"


export interface IReply extends Document{
    content?:string,
    attachments?:string[],
    assetFolderId?:string,
    commentId:Schema.Types.ObjectId,
    createdBy?: Schema.Types.ObjectId,
    tags?:Schema.Types.ObjectId[],
    deletedAt?:Date,
    deletedBy?:Schema.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date,
    isDeleted?:boolean,
}