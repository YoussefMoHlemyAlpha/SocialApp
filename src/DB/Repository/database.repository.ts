import { Model,FilterQuery, ProjectionType, QueryOptions, CreateOptions, UpdateQuery } from "mongoose";
import { IUser } from "../../common/Interfaces/user.interface";
import { DeleteResult } from 'mongodb';
export class DatabaseRepository <T> {


constructor(protected readonly model:Model<T>){}

async findOne({
  filter,
  select,
  options,
}: {
  filter: FilterQuery<T>;
  select?: ProjectionType<T> | null;
  options?: QueryOptions<T>;
}): Promise<T | null> {
  return this.model.findOne(filter, select, options).exec();
}



async createOne({
  data,
  options,
}: {
  data: Partial<T>;
  options?: CreateOptions;
}): Promise<T> {
  const doc = await this.model.create(data);
  return doc as T;
}


async updateOne({ updatedData, filter }: { updatedData: UpdateQuery<IUser>, filter?: UpdateQuery<IUser> }): Promise<IUser | null> {
    return this.model.findOneAndUpdate(filter, updatedData, { new: true });
}

  async deleteOne({ filter }: { filter: FilterQuery<T> }): Promise<T | null> {
    return this.model.findOneAndDelete(filter);
  }

  async deleteMany({ filter }: { filter: FilterQuery<T> }): Promise<DeleteResult> {
    return this.model.deleteMany(filter);
  }
}


