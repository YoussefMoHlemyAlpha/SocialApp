import { Socket } from "socket.io";
import { UserRepository } from "../../DB/Repository/user.repository";
import { NotFoundError } from "../../utils/Error";
import { AuthentictedSocket, connectedSockets } from "../gateway/gateway";
import { chatRepo } from "./chat.repo";
import { $Command } from "@aws-sdk/client-s3";




export class chatSocketServices {
    private userRepo = new UserRepository()
    private chatRepo = new chatRepo()
    constructor() { }
    sendMessage = async (socket: AuthentictedSocket, data: { sendTo: string, content: string }) => {
        try {
            const createdBy = socket.user?._id
            const to = await this.userRepo.findOne({ filter: { _id: data.sendTo } })
            if (!to) {
                throw new NotFoundError('user not found')
            }
            const chat = await this.chatRepo.findOne({
                filter: {
                    participants: {
                        $all: [createdBy, data.sendTo]
                    },
                    group: {
                        $exists: false
                    }
                }
            })
            if (!chat) {
                throw new NotFoundError('chat not found')
            }

            await this.chatRepo.updateOne({
                filter: { _id: chat._id },
                updatedData: {
                    $push: {
                        message: {
                            content: data.content,
                            createdBy: createdBy,
                            createdAt: new Date()
                        }
                    }
                }
            });
            socket.emit('successMessage', data.content)
            socket.to(connectedSockets.get(to._id.toString() as string) || []).emit('newMessage', { content: data.content, from: socket.user })

        } catch (error) {
            socket.emit('customError', error)
        }

    }

    joinRoom = async (socket: AuthentictedSocket, roomId: string) => {
        try {
            const group = await this.chatRepo.findOne({
                filter: {
                    roomId,
                    participants: {
                        $in: [socket.user?._id]
                    },
                    group: {
                        $exists: true
                    }
                }
            })
            if (!group) {
                throw new NotFoundError('group not found')
            }
            socket.join(group.roomId as string)



        } catch (error) {
            socket.emit('customError', error)
        }
    }

    sendGroupMessage=async(socket:AuthentictedSocket,data:{content:string,groupId:string})=>{
     try{
    const createdBy=socket.user?._id
    const group=await this.chatRepo.findOne({
        filter:{_id:data.groupId ,
            participants:{
                $in:[createdBy]
            },
            group:{
                $exists:true
            }
 
        }

})

if(!group){
    throw new NotFoundError('group not found')  
}

await this.chatRepo.updateOne({
    filter:{_id:group._id},
    updatedData:{$push:{message:{content:data.content,createdBy:createdBy,createdAt:new Date()}}}
})
socket.emit('successMessage',data.content)
socket.to(group.roomId as string).emit('newMessage',{content:data.content,from:socket.user,groupId:group._id})
     }catch(error){
        socket.emit('customError',error)
     }
    

}

}