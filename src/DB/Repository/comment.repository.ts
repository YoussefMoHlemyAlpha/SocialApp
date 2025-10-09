import { IComment } from "../../common/Interfaces/comment.interface"
import { CommentModel } from "../Models/comment.model"
import { DatabaseRepository } from "./database.repository"


export class CommentRepository extends DatabaseRepository<IComment>{
constructor(){
    super(CommentModel)
}

}
