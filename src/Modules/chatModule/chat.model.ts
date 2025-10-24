import { HydratedDocument, Types,Schema, model, models,Document } from "mongoose"



export interface IMessage extends Document{
createdAt:Date,
createdBy:Types.ObjectId,
content:string,
updatedAt:Date
}

export type HMessageDocument= HydratedDocument<IMessage>


const messageSchema=new Schema<IMessage>({
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    content:{
        type:String,
        maxlength:1000,
        minlength:1,
        trim: true,
        required:true
    },
    createdAt:Date,
    updatedAt:Date,
     

},{timestamps:true})

export interface IChat extends Document{
    // OVO
    participants:Types.ObjectId[]
    message:IMessage[]


    //OVM
    group?:string
    groupImage?:string,
    roomId:string

    //common
    createdAt:Date,
    updatedAt:Date,
    createdBy:Types.ObjectId
}

export type HChatDocument= HydratedDocument<IChat>

const chatSchema=new Schema<IChat>({
    participants:[{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }],
    message:[messageSchema],
        createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    group:String,
    groupImage:String,
    roomId:String
},{timestamps:true})

export const ChatModel=models.Chat|| model<IChat>("Chat",chatSchema)
