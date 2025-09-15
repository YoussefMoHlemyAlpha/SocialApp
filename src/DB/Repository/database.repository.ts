import { Model,FilterQuery, ProjectionType, QueryOptions, CreateOptions } from "mongoose";

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





}