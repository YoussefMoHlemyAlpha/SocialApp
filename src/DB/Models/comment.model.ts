import { IComment } from "../../common/Interfaces/comment.interface";
import { model, Schema, Types } from "mongoose";


export const commentSchema=new Schema<IComment>({
    content:{
        type:String
    },
    postId:{
        type:Types.ObjectId,
        ref:"Post",
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
    toObject:{virtuals:true},
})


export const CommentModel=model<IComment>('Comment',commentSchema)

