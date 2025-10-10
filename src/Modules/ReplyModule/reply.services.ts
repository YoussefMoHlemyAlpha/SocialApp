import { IReplyServices } from "../../common/Interfaces/reply.interface"
import { PostRepository } from "../../DB/Repository/post.repository"
import { UserRepository } from "../../DB/Repository/user.repository"
import { CommentRepository } from "../../DB/Repository/comment.repository"
import { Request, Response, NextFunction } from "express"
import { sucessHandler } from "../../utils/sucessHandler"
import { ApplicationException, NotFoundError } from "../../utils/Error"
import { nanoid } from "nanoid"
import { uploadMultipleFiles } from "../../utils/multer/s3.services"
import { ReplyRepository } from "../../DB/Repository/reply.repository"

export class ReplyServices implements IReplyServices {
    private postRepo = new PostRepository()
    private ReplyRepo=new ReplyRepository()
    private userRepo = new UserRepository()
    private Commentrepo=new CommentRepository()
    constructor() { }

 createReply=async(req: Request, res: Response, next: NextFunction): Promise<Response>=> {
    const commentId=req.params.id 
    let attachments:string[]=[]
    const files:Express.Multer.File[]=req.files as Express.Multer.File[] 
    const userId=res.locals.user._id
    const comment=await this.Commentrepo.findOne({filter:{
        _id:commentId
    }})
    if(!comment){
        throw new NotFoundError('Comment is not Found')
    }
    const post=await this.postRepo.findOne({filter:{
    _id:comment.postId
    }})
    const ownerPost=await this.userRepo.findOne({filter:{
        _id:post?.createdBy
    }})
    const assetFolderId=nanoid(15)
    const path = `/users/${ownerPost}/posts/${comment.postId}/comments${commentId}/Replys${assetFolderId}`
    const users = await this.userRepo.find({
                filter: {
                    _id: {
                        $in: req.body.tags
                    }
                }
            })
 /*if (req.body.tags.length != users.length) {
                    throw new ApplicationException('There are some users not exist', 404)
        }  */   
        if (files?.length) {
                        attachments = await uploadMultipleFiles({
                            files,
                            path
                        })
                    }      
const reply = await this.ReplyRepo.createOne({
            data: {
                ...req.body,
                attachments,
                createdBy:userId,
                assetFolderId,
                commentId:commentId,
                postId:comment.postId
            
            }
 })

     return sucessHandler({res,status:201,data:reply,msg:"Reply is created successfully"})
 }   

}