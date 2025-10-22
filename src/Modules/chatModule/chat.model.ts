import { HydratedDocument, Types,Schema, model, models } from "mongoose"



export interface IMessage{
createdAt:Date,
createdBy:Types.ObjectId,
content:string,
updatedAt:Date
}

export type HMessageDocument= HydratedDocument<IMessage>


const messageSchema=new Schema<IMessage>({
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:Date,
    updatedAt:Date,
     

},{timestamps:true})

export interface IChat{
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
        ref:"User",
        required:true
    }],
    message:[messageSchema],
        createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    group:String,
    groupImage:String,
    roomId:String
},{timestamps:true})

export const ChatModel=models.Chat|| model<IChat>("Chat",chatSchema)
