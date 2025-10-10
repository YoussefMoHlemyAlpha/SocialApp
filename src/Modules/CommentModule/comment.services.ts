import { Request, Response, NextFunction } from "express";
import { ICommentServices } from "../../common/Interfaces/comment.interface";
import { sucessHandler } from "../../utils/sucessHandler";
import { CommentRepository } from "../../DB/Repository/comment.repository";
import { UserRepository } from "../../DB/Repository/user.repository";
import { PostRepository } from "../../DB/Repository/post.repository";
import { nanoid } from "nanoid";
import { ApplicationException, NotFoundError } from "../../utils/Error";
import { uploadMultipleFiles } from "../../utils/multer/s3.services";
import { Types,HydratedDocument } from "mongoose";
import { ReplyRepository } from "../../DB/Repository/reply.repository";
import { IUser } from "../../common/Interfaces/user.interface";

export class CommentServices implements ICommentServices{
 constructor() { }

 private Commentrepo=new CommentRepository()
 private userRepo=new UserRepository()
 private PostRepo=new PostRepository()
 private replyRepo=new ReplyRepository()

createComment=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const postId=req.params.id 
    let attachments:string[]=[]
    const files:Express.Multer.File[]=req.files as Express.Multer.File[]
    const userId=res.locals.user._id
    const post=await this.PostRepo.findOne({filter:{_id:postId}})
    if(!post){
        throw new NotFoundError('Not Found Error')
    }
    if(post.isfreezed){
            throw new ApplicationException('This post is freezed',409)
        }
    const postOwner=await this.userRepo.findOne({filter:{_id:post?.createdBy}})
    if (postOwner?.blockUsers.includes(userId)) {
            throw new ApplicationException('You are blocked', 409)
        }
    if(!post.allowComments){
        throw new ApplicationException('You are not allowed to comment on this post',409)
    }
    const assetFolderId=nanoid(15)
    const path = `/users/${post.createdBy}/posts/${postId}/comments${assetFolderId}`
    const users = await this.userRepo.find({
                filter: {
                    _id: {
                        $in: req.body.tags
                    }
                }
            })
            
   /* if (req.body.tags.length != users?.length) {
                throw new ApplicationException('There are some users not exist', 404)
    }      */    
    if (files?.length) {
                    attachments = await uploadMultipleFiles({
                        files,
                        path
                    })
                }
            const comment = await this.Commentrepo.createOne({
            data: {
                ...req.body,
                attachments,
                createdBy:userId,
                assetFolderId,
                postId:postId
            }
        })
    
    return sucessHandler({res,status:201,data:comment,msg:"Comment is created Successfully"})
}


updateComment=async(req: Request, res: Response, next: NextFunction): Promise<Response>=> {
   const commentId=req.params.id 
   const userId=res.locals.user.id 
       const{
           content,
           removedTags,
           newTags,
           Removedattachments,
       }:{
           content:string,
           removedTags:Types.ObjectId[],
           newTags:string[],
           Removedattachments:Array<string>,
       }=req.body

let attachmentsLinks:string[]=[]
const newAttachments=(req.files as Array<Express.Multer.File>)
const comment = await this.Commentrepo.findOne({
    filter:{
        _id:commentId,
        createdBy:userId
    }
})

if(!comment){
    throw new NotFoundError('Comment Not Found')
}
const post=await this.PostRepo.findOne({
    filter:{
        _id:comment.postId
    }
})
const users=await this.userRepo.find({
    filter:{
        _id:{
            $in:newTags||[]
        }
    }
})

if(users?.length != newTags?.length){
throw new ApplicationException('There are some users not exist', 404)
}

if(newAttachments.length){
    attachmentsLinks=await uploadMultipleFiles({
        files:newAttachments,
        path:`/users/${post?.createdBy}/posts/${post?._id}/comments/${comment._id}`
    })
}

await this.Commentrepo.updateOne({
  updatedData: {
    $set: {
      content: content || comment.content,
      attachments: {
        $setUnion: [
          {
            $setDifference: [
              '$attachments',
              Removedattachments
            ]
          },
          attachmentsLinks
        ]
      },
    tags: {
        $setUnion: [
          {
            $setDifference: [
              '$tags',
              removedTags
            ]
          },
          newTags.map((tag:string)=>{
                 return Types.ObjectId.createFromHexString(tag)
          })
        ]
      }
    }
  },
});
    return sucessHandler({res,status:200,msg:'Comment is updated sucessfully',data:comment})
}


getCommentById=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const commentId=req.params.id
    if(!commentId){
        throw new ApplicationException('please insert send comment id',409)
    }
    const comment=await this.Commentrepo.findOne({filter:{
        _id:commentId
    }})
    if(!comment){
        throw new NotFoundError('Comment is not Found')
    }  
    return sucessHandler({res,status:200,data:comment})
}


getCommentWithReply=async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const commentId=req.params.id
    if(!commentId){
        throw new ApplicationException('please insert send comment id',409)
    }
    const comment=await this.Commentrepo.findOne({filter:{
        _id:commentId
    }})
    if(!comment){
        throw new NotFoundError('Comment is not Found')
    }  

    const replies=await this.replyRepo.find({filter:{
        commentId:commentId
    }})

    return sucessHandler({res,status:200,data:{comment:comment ,replies:replies}})
}


deleteComment=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const deletedCommentId=req.params.id
    const user= res.locals.user as HydratedDocument<IUser>
    const comment=await this.Commentrepo.findOne({filter:{_id:deletedCommentId}})
    if(!comment){
        throw new NotFoundError('comment not found')
    }
    if(user._id!=comment.createdBy){
       throw new ApplicationException('You are not the owner of this post',409)
    }
    const post =await this.PostRepo.findOne({filter:{_id:comment.postId}})
    if(post?.isfreezed){
        throw new ApplicationException('post is freezed',409)
    }
    const replies=await this.replyRepo.find({filter:{commentId:comment._id}})

    await this.replyRepo.deleteMany({filter:{commentId:comment._id}})
    
    await this.Commentrepo.deleteOne({filter:{_id:comment._id}})

    return sucessHandler({res,status:200,msg:"Comment is deleted successfully"})
}
}
