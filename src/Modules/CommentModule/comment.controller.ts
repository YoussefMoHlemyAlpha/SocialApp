import { Router } from "express";
import { CommentServices} from "./comment.services";
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { uploadFile } from "../../utils/multer/multer";

export const CommentRouter=Router()
const CommentService=new CommentServices()


const CommentRoutes={
createComment:"/create-comment",
updateComment:'/update-comment',
getCommentById:'/get-comment:id',
getCommentWithId:'/get-comment-replies/:id'
}

CommentRouter.post(CommentRoutes.createComment,auth(),uploadFile({}).array('attachments',5),CommentService.createComment)

CommentRouter.post(CommentRoutes.updateComment,auth(),uploadFile({}).array('newAttachments',5),CommentService.updateComment)

CommentRouter.get(CommentRoutes.getCommentById,CommentService.getCommentById)

CommentRouter.get(CommentRoutes.getCommentWithId,CommentService.getCommentWithReply)