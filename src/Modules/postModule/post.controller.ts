import { Router } from "express";
import { PostServices } from "./post.services";
import { validation } from "../../middleware/validation.middleware";
import { createPostSchema ,LikeandUnlikeSchema} from "./post.validation";
import { uploadFile } from "../../utils/multer/multer";
import { auth } from "../../middleware/auth.middleware";
export const postRouter=Router()
const postservice=new PostServices()

const postRoutes={
    createPost:'/create-post',
    likeAndUnlikePost:'/like-unlike',
    updatePost:'/update-post',
    getPost:'/get-post/:id'
}



postRouter.post(postRoutes.createPost,auth(),uploadFile({}).array('attachments', 5),validation(createPostSchema),postservice.createPost)

postRouter.post(postRoutes.likeAndUnlikePost,auth(),validation(LikeandUnlikeSchema),postservice.LikeandUnlikePost)

postRouter.patch(postRoutes.updatePost,auth(),uploadFile({}).array('newattachments', 5),postservice.updatePost)

postRouter.get(postRoutes.getPost,postservice.getPostById)

