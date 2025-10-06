import { Router } from "express";
import { PostServices } from "./post.services";
import { validation } from "../../middleware/validation.middleware";
import { createPostSchema } from "./post.validation";
import { uploadFile } from "../../utils/multer/multer";

export const postRouter=Router()
const postservice=new PostServices()

const postRoutes={
    createPost:'/create-post'
}



postRouter.post(postRoutes.createPost,uploadFile({}).array('attachments', 5),validation(createPostSchema),postservice.createPost)
