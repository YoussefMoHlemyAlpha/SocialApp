import { IUser } from "../../common/Interfaces/user.interface";
import { userModel } from "../Models/user.model";
import { DatabaseRepository } from "./database.repository";
import { FilterQuery, ObjectId, QueryOptions, UpdateQuery } from "mongoose";


export class UserRepository extends DatabaseRepository<IUser>{
constructor(){
    super(userModel)
}

async findByEmail(email: string): Promise<IUser | null> {
  return this.findOne({ filter: { email } });
}

async findById(id: ObjectId,options?:any): Promise<IUser | null> {
  return this.findOne({ filter: { _id : id} });
}

async find({filter,options}:{filter?:FilterQuery<IUser>,options?:any}): Promise<IUser[]> {
  return this.model.find({...filter,deleteAt:{$exists:false}},options); 
}

async findByOTP(otp: string): Promise<IUser | null> {
  return this.findOne({ filter: { twoStepVerification: { Otp: otp } } });
}
}