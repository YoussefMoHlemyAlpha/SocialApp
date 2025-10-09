import { Request, Response, NextFunction } from "express";
import { IPostServices } from "../../common/Interfaces/post.interface";
import { PostRepository } from "../../DB/Repository/post.repository";
import { UserRepository } from "../../DB/Repository/user.repository";
import { sucessHandler } from "../../utils/sucessHandler";
import { nanoid } from "nanoid";
import { ApplicationException, NotFoundError } from "../../utils/Error";
import { uploadMultipleFiles } from "../../utils/multer/s3.services";
import { LikeandUnlikeDTO } from "./post.DTO";
import { availabilityConditions } from "../../DB/Models/post.model";
import { HydratedDocument, ObjectId,Types } from "mongoose";
import { IUser } from "../../common/Interfaces/user.interface";
import { NotFound } from "@aws-sdk/client-s3";
import { emailEventEmitter, generateOtp } from "../../utils/emails/emailEvents";
import { allowComments, availability } from "../../common/Enums/post.enum";
export class PostServices implements IPostServices {
    private postRepo = new PostRepository()
    private userRepo = new UserRepository()

    constructor() { }

    createPost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const files: Express.Multer.File[] = req.files as Express.Multer.File[]
        const Senduser = res.locals.user
        const assetFolderId = nanoid(15)
        const path = `/users/${Senduser._id}/posts/${assetFolderId}`
        let attachments: string[] = [];
        if (req.body.tags?.length) {
            const users = await this.userRepo.find({
                filter: {
                    _id: {
                        $in: req.body.tags
                    }
                }
            })
            if (req.body.tags.length != users.length) {
                throw new ApplicationException('There are some users not exist', 404)
            }
            // Send Email To Tagged Friends
            for (const user of users) {
                emailEventEmitter.emit('NotifyTaggedUsers', { email: user.email, firstName: user.firstName, friendName: Senduser.firstName })

            }


            if (files?.length) {
                attachments = await uploadMultipleFiles({
                    files,
                    path
                })
            }
        }
        const post = await this.postRepo.createOne({
            data: {
                ...req.body,
                attachments,
                createdBy: res.locals.user._id,
                assetFolderId

            }
        })
        return sucessHandler({ res, status: 201, msg: "Post created sucessfully", data: post })
    }

    LikeandUnlikePost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const { postId, likeType }: LikeandUnlikeDTO = req.body
        const user: HydratedDocument<IUser> = res.locals.user
        const post = await this.postRepo.findOne({
            filter: {
                _id: postId,
                $or: availabilityConditions(user)
            }
        })

        if (!post) {
            throw new NotFoundError('Post not Found')
        }

        if (likeType == 'like') {
            await this.postRepo.updateOne({
                filter: { _id: postId },
                updatedData: {
                    $addToSet: {
                        likes: user._id
                    }
                }
            })
        } else {
            await this.postRepo.updateOne({
                filter: { _id: postId },
                updatedData: {
                    $pull: {
                        likes: user._id
                    }
                }
            })
        }
        await post.save()
        return sucessHandler({ res, status: 200, msg: "Done", data: post })

    }
updatePost=async(req: Request, res: Response, next: NextFunction): Promise<Response> =>{
    const postId=req.params.id
    const userId=res.locals.user._id
    const assetFolderId=res.locals.user.assetFolderId
    const{
        content,
        availability,
        allowComments,
        removedTags,
        newTags,
        Removedattachments,
    }:{
        content:string,
        availability:availability,
        allowComments:boolean
        removedTags:Types.ObjectId[],
        newTags:string[],
        Removedattachments:Array<string>,
    }=req.body
let attachmentsLinks :string[]=[]

const newAttachments=(req.files as Array<Express.Multer.File>)
const post = await this.postRepo.findOne({
    filter:{
        _id:postId,
        createdBy:userId
    }
})

if(!post){
    throw new NotFoundError('Post Not Found')
}


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
        path:`/users/${userId}/posts/${assetFolderId}`
    })
}


await this.postRepo.updateOne({
  updatedData: {
    $set: {
      content: content || post.content,
      availability: availability || post.availability,
      allowComments: allowComments || post.allowComments,
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


















  return sucessHandler({res,status:200,msg:"Post is updated"})  
}
}