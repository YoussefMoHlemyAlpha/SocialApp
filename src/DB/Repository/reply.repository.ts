import { IReply } from "../../common/Interfaces/reply.interface"
import { ReplyModel } from "../Models/reply.model"
import { DatabaseRepository } from "./database.repository"
import { FilterQuery } from "mongoose"

export class ReplyRepository extends DatabaseRepository<IReply>{
constructor(){
    super(ReplyModel)
}

async find({filter,options}:{filter?:FilterQuery<IReply>,options?:any}): Promise<IReply[]> {
  return this.model.find({...filter,deleteAt:{$exists:false}},options); 
}


}