import { IPost} from "../../common/Interfaces/post.interface";
import { postModel } from "../Models/post.model";
import { DatabaseRepository } from "./database.repository";
import { FilterQuery, ObjectId, UpdateQuery } from "mongoose";


export class PostRepository extends DatabaseRepository<IPost>{
constructor(){
    super(postModel)
}
async find({filter,options}:{filter?:FilterQuery<IPost>,options?:any}): Promise<IPost[]> {
  return this.model.find({...filter,deleteAt:{$exists:false}},options); 
}
}