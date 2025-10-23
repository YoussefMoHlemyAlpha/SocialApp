import { Request,Response } from "express"
import { UserRepository } from "../../DB/Repository/user.repository"
import { chatRepo } from "./chat.repo"
import { NotFoundError } from "../../utils/Error"
import { sucessHandler } from "../../utils/sucessHandler"
import { Types } from "mongoose"

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
}