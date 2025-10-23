import { DatabaseRepository } from "../../DB/Repository/database.repository";
import { ChatModel, IChat } from "./chat.model";
import { Model } from "mongoose";



export class chatRepo extends DatabaseRepository<IChat>{
constructor(protected override readonly model:Model<IChat> = ChatModel){
    super(model)
}
}