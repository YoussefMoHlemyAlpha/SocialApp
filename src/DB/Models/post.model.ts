import { Schema,model,Types, HydratedDocument } from "mongoose";
import { IPost } from "../../common/Interfaces/post.interface";
import { allowComments, availability } from "../../common/Enums/post.enum";
import { IUser } from "../../common/Interfaces/user.interface";
export const availabilityConditions=(user:HydratedDocument<IUser>)=>{
    return[
        {
            availability:availability.public

        },
        {
            availability:availability.private,
            createdBy:user._id
        },
        {
            availability:availability.friends,
            createdBy:{
                $in:[...user.friends,user._id]
            }
        },
        {
            availability:availability.private,
            tags:{$in:user._id}
        }
    ]
}
export const postSchema = new Schema<IPost>({
    content:{
        type:String,
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

    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isfreezed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

export const postModel = model<IPost>("Post",postSchema)