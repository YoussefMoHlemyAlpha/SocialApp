import { IPost} from "../../common/Interfaces/post.interface";
import { postModel } from "../Models/post.model";
import { DatabaseRepository } from "./database.repository";
import { FilterQuery, ObjectId, UpdateQuery } from "mongoose";


export class PostRepository extends DatabaseRepository<IPost>{
constructor(){
    super(postModel)
}

}