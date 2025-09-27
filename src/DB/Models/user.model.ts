import { model, Schema} from "mongoose"
import { IUser } from "../../common/Interfaces/user.interface"
import { Roles } from "../../common/Enums/user.enum"
import { ApplicationException } from "../../utils/Error"
import { hashText } from "../../utils/bcrypt"


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
    Key:String,
    slug:String,
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


userSchema.virtual('username').set(function(value:string){
    const[firstName,lastName]=value.split(" ")|| []
    this.set({firstName,lastName,slug:value.replaceAll(/\s+/g,'-')})
})
.get(function(){
    return`${this.firstName} ${this.lastName}`
})

userSchema.pre("validate",function(next){
    console.log('pre hook',this);
    if(!this.slug?.includes('-')){
        throw new ApplicationException("slug is required and must contain '-' ",409)
    }
    next()
})

userSchema.pre("save", async function (next) {
  console.log("pre save hook:", this);

  if (this.isModified("password")) {
    this.password = `${hashText(this.password) }`;
 
  }

  next();
});

userSchema.post("save", function (doc) {
  console.log("post save hook, user created:", doc);
 
});



export const userModel=model<IUser>('user',userSchema)