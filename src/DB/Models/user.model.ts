import { model, Schema} from "mongoose"
import { IUser } from "../../common/Interfaces/user.interface"
import { Roles } from "../../common/Enums/user.enum"


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
    },
    passwordOtp:{
        Otp:{
            type:String
        },
        expireAt:{
        type:Date 
        }
    },
    isConfirmed:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(Roles),
        default:Roles.user
    },
    profileImage:String,
    coverImages:[{
        type:String
    }],
    isCredentialUpdated:Date
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