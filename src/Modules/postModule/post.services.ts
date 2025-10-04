import { Request, Response, NextFunction } from "express";
import { IPostServices } from "../../common/Interfaces/post.interface";
import { PostRepository } from "../../DB/Repository/post.repository";
import { UserRepository } from "../../DB/Repository/user.repository";

export class PostServices implements IPostServices{
private postRepo=new PostRepository()
private userRepo=new UserRepository()

constructor(){}

createPost=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    return res.status(201).json({message:"Post Created"})
}


}