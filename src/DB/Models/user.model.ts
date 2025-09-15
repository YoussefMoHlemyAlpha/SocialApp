import { model, Schema} from "mongoose"
import { IUser } from "../../common/Interfaces/user.interface"


const userSchema=new Schema<IUser>({
    firstName:{
     type:String,
     required:true
    },
    lastName:{
    type:String,
     required:true  
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String
    },
    emailOtp:{
        Otp:{
            type:String
        },
        expireAt:{
        type:Date
        }
    }


},
{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }

}
)

export const userModel=model<IUser>('user',userSchema)