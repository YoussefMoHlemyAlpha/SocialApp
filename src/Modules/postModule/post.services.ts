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
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { IUser } from "../../common/Interfaces/user.interface";
import { NotFound } from "@aws-sdk/client-s3";
import { emailEventEmitter, generateOtp } from "../../utils/emails/emailEvents";
import { allowComments, availability } from "../../common/Enums/post.enum";
import { CommentRepository } from "../../DB/Repository/comment.repository";
import { ReplyRepository } from "../../DB/Repository/reply.repository";
export class PostServices implements IPostServices {
    private postRepo = new PostRepository()
    private userRepo = new UserRepository()
    private commentRepo = new CommentRepository()
    private replyRepo = new ReplyRepository()

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
        if (post.isfreezed) {
            throw new ApplicationException('This post is freezed', 409)
        }
        const postOwner = await this.userRepo.findOne({ filter: { _id: post.createdBy } })
        if (postOwner?.blockUsers.includes(user.id)) {
            throw new ApplicationException('You are blocked', 409)
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
    updatePost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const postId = req.params.id
        const userId = res.locals.user._id
        const assetFolderId = res.locals.user.assetFolderId
        const {
            content,
            availability,
            allowComments,
            removedTags,
            newTags,
            Removedattachments,
        }: {
            content: string,
            availability: availability,
            allowComments: boolean
            removedTags: Types.ObjectId[],
            newTags: string[],
            Removedattachments: Array<string>,
        } = req.body
        let attachmentsLinks: string[] = []

        const newAttachments = (req.files as Array<Express.Multer.File>)
        const post = await this.postRepo.findOne({
            filter: {
                _id: postId,
                createdBy: userId
            }
        })

        if (!post) {
            throw new NotFoundError('Post Not Found')
        }


        const users = await this.userRepo.find({
            filter: {
                _id: {
                    $in: newTags || []
                }
            }
        })


        if (users?.length != newTags?.length) {
            throw new ApplicationException('There are some users not exist', 404)
        }


        if (newAttachments.length) {
            attachmentsLinks = await uploadMultipleFiles({
                files: newAttachments,
                path: `/users/${userId}/posts/${assetFolderId}`
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
                            newTags.map((tag: string) => {
                                return Types.ObjectId.createFromHexString(tag)
                            })
                        ]
                    }
                }
            },
        });

        return sucessHandler({ res, status: 200, msg: "Post is updated" })
    }

    getPostById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const postId = req.params.id
        if (!postId) {
            throw new ApplicationException('please insert send post id', 409)
        }
        const post = await this.postRepo.findOne({
            filter: {
                _id: postId
            }
        })
        if (!post) {
            throw new NotFoundError('post is not Found')
        }
        return sucessHandler({ res, status: 200, data: post })
    }



    freezePost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const postId = req.params.id
        const post = await this.postRepo.findOne({ filter: { _id: postId } })
        if (!post) {
            throw new NotFoundError("post not found")
        }
        if (post.isfreezed) {
            throw new ApplicationException('post is already freezed', 409)
        }
        post.isfreezed = true
        await post.save()
        return sucessHandler({ res, status: 200, msg: "Post is freezed now !" })
        // After that we deny user to react or comment on this freezed post but not here
        // we will handle this in (like-unlike  and   createComment ) APIs 
    }

    hardDeletePost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const postId = req.params.id
        const user = res.locals.user as HydratedDocument<IUser>
        const userId = user._id as Types.ObjectId
        const post = await this.postRepo.findOne({ filter: { _id: postId } })
        if (!post) {
            throw new NotFoundError('post not found')
        }

        if (post.isfreezed) {
            throw new NotFoundError('post is freezed')
        }
        if (!userId.equals(post.createdBy)) {
            throw new ApplicationException('You are not the owner of this post', 409);
        }

        const comments = await this.commentRepo.find({ filter: { postId: post._id } })
        const replies = await this.replyRepo.find({ filter: { postId: post._id } })

        await this.replyRepo.deleteMany({ filter: { postId: post._id } })

        await this.commentRepo.deleteMany({ filter: { postId: post._id } })

        await this.postRepo.deleteOne({ filter: { _id: post._id } })

        return sucessHandler({ res, status: 200, msg: "Post is deleted sucessfully" })
    }
}