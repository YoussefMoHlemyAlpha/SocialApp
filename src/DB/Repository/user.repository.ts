import { IUser } from "../../common/Interfaces/user.interface";
import { userModel } from "../Models/user.model";
import { DatabaseRepository } from "./database.repository";
import { FilterQuery } from "mongoose";


export class UserRepository extends DatabaseRepository<IUser>{
constructor(){
    super(userModel)
}

async findByEmail(email: string): Promise<IUser | null> {
  return this.findOne({ filter: { email } });
}

}
