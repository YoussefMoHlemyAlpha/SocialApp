import { Schema,model,Types, HydratedDocument } from "mongoose";
import { IReply } from "../../common/Interfaces/reply.interface";

export const ReplySchema= new Schema<IReply>({
    content:{
        type:String
    },
    postId:{
        type:Types.ObjectId,
        ref:"Post",
        required:true
    },
    commentId:{
       type:Types.ObjectId,
        ref:"Comment",
        required:true
    },
    attachments:[{
        type:String
    }
    ],
    assetFolderId:{
        type:String
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    tags:[{
        type:Types.ObjectId,
        ref:"User"
    }
    ],
     deletedAt:{
        type:Date
     },
     deletedBy:{
        type:Types.ObjectId,
        ref:"User"
     },
     createdAt:{
        type:Date
     },
     updatedAt:{
        type:Date
     },
     isDeleted:{
        type:Boolean,
        default:false
     }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export const ReplyModel = model<IReply>("Reply",ReplySchema)