import { Router } from "express";
import { ReplyServices } from "./reply.services";
import { auth } from "../../middleware/auth.middleware";
import { uploadFile } from "../../utils/multer/multer";
import { validation } from "../../middleware/validation.middleware";
import { createReplySchema } from "./reply.validation";


export const ReplyRouter=Router()
export const ReplyService=new ReplyServices()

const ReplyRoutes={
    createReply:'create-reply'
}

ReplyRouter.post(ReplyRoutes.createReply,auth(),uploadFile({}).array('newAttachements',5),validation(createReplySchema),ReplyService.createReply)