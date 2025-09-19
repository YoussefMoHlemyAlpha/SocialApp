import { Model,FilterQuery, ProjectionType, QueryOptions, CreateOptions, UpdateQuery } from "mongoose";

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
}): Promise<T[]> {
  return this.model.create([data], options);
}

async updateOne({updatedData,filter}:{updatedData:UpdateQuery<T>,filter:UpdateQuery<T>}):Promise<T|null>{
return this.model.findOneAndUpdate(filter,updatedData,{new:true})

}
}