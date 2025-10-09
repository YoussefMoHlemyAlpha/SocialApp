import { Document,Schema } from "mongoose"


export interface IComment extends Document{
    content?:string,
    attachments?:string[],
    assetFolderId?:string,
    createdBy?: Schema.Types.ObjectId,
    tags?:Schema.Types.ObjectId[],
    deletedAt?:Date,
    deletedBy?:Schema.Types.ObjectId,
    createdAt?:Date,
    updatedAt?:Date,
    isDeleted?:boolean,
}