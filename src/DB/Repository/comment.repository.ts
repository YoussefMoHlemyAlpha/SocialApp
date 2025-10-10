import { IComment } from "../../common/Interfaces/comment.interface"
import { CommentModel } from "../Models/comment.model"
import { DatabaseRepository } from "./database.repository"
import { FilterQuery } from "mongoose"

export class CommentRepository extends DatabaseRepository<IComment>{
constructor(){
    super(CommentModel)
}
async find({filter,options}:{filter?:FilterQuery<IComment>,options?:any}): Promise<IComment[]> {
  return this.model.find({...filter,deleteAt:{$exists:false}},options); 
}
}
