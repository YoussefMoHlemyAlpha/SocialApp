import { Router } from "express";
import { PostServices } from "./post.services";


export const postRouter=Router()
const postservice=new PostServices()

postRouter.post('/create-post',postservice.createPost)
