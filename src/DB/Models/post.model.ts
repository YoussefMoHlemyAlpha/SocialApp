import { Schema,model,Types } from "mongoose";
import { IPost } from "../../common/Interfaces/post.interface";
import { allowComments, availability } from "../../common/Enums/post.enum";


export const postSchema = new Schema<IPost>({
    content:{
        type:String,
        maxlength:5000,
        required: function(){return this.attachments?.length===0}
    },
    attachments:[{
        type:String
    }],
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
    }],
    likes:[{
        type:Types.ObjectId,
        ref:"User"
    }],
    allowComments:{
        type:String,        
        enum:Object.values(allowComments),
        default:allowComments.allow
    },
    availability:{
        type:String,
        enum:Object.values(availability),
        default:availability.public
    },
    deletedAt:{
        type:Date,

    },
    deletedBy:{
        type:Types.ObjectId,
        ref:"User",
 
    },
    restoredAt:{
        type:Date,
       
    },
    restoredBy:{
        type:Types.ObjectId,
        ref:"User",

    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export const postModel = model<IPost>("Post",postSchema)