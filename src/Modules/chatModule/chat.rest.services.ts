import { Request,Response } from "express"
import { UserRepository } from "../../DB/Repository/user.repository"
import { chatRepo } from "./chat.repo"
import { ApplicationException, NotFoundError } from "../../utils/Error"
import { sucessHandler } from "../../utils/sucessHandler"
import { Types } from "mongoose"
import { CreateGroupDTO } from "./chat.DTO"
import { nanoid } from "nanoid"
import { populate } from "dotenv"
export class chatServices{

    private userRepo=new UserRepository()
    private chatRepo=new chatRepo()

    constructor(){}

    getChat=async(req:Request,res:Response)=>{

     const userId=Types.ObjectId.createFromHexString(req.params.userId as string)
     const loggedUser=res.locals.user
     const to=await this.userRepo.findOne({filter:{
        _id:userId,
    }
  })
  if(!to){
    throw new NotFoundError('user not found')
  }
  const chat=await this.chatRepo.findOne({
    filter:{
        participants:{
            $all:[loggedUser._id,userId]
        },
        group:{
            $exists:false
        }
        
    }, options:{
        populate:'participants'
    }
  })
  if(!chat){
    const newChat=await this.chatRepo.createOne({
        data:{
            participants:[loggedUser._id,userId],
            createdBy:loggedUser._id,
            message:[]
        }
    })
    return sucessHandler({res,status:201,data:newChat})
  }
  return sucessHandler({res,status:200,data:chat})
    }


    createGroup=async(req:Request,res:Response)=>{
      const {group,participants}:CreateGroupDTO=req.body
      const user=res.locals.user
      const dbParticipants=await this.userRepo.find({filter:{
        _id:{$in:participants}
      }})
      if(dbParticipants.length!==participants.length){
        throw new NotFoundError('user not found')
      }
      const roomId=nanoid(15)
      const newGroup=await this.chatRepo.createOne({
        data:{
          roomId:roomId,
          group,
          participants:[...participants,user._id],
          createdBy:user._id,
          message:[]
        }
      })
      if(!newGroup){
        throw new ApplicationException('Internal Server Error',500)
      }
      return sucessHandler({res,status:201,data:newGroup})
    }


    getGroupChat=async(req:Request,res:Response)=>{
      const groupId=req.params.id
      const user=res.locals.user
      const chat=await this.chatRepo.findOne({filter:{
        group:{
          $exists:true
        },
        _id:groupId,

        participants:{
          $in:user._id
        }
      },
      options:{
        populate:'message.createdBy'
      }
    
    })

    if(!chat){
      throw new NotFoundError('chat not found')
    }

    return sucessHandler({res,status:200,data:{chat}})
    }
}