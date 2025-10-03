import { HydratedDocument, model, Schema, UpdateQuery} from "mongoose"
import { IUser } from "../../common/Interfaces/user.interface"
import { Roles } from "../../common/Enums/user.enum"
import { ApplicationException } from "../../utils/Error"
import { hashText } from "../../utils/bcrypt"
import { emailEventEmitter } from "../../utils/emails/emailEvents"


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
    newEmailOtp:{
        Otp:{
            type:String
        },
        expireAt:{
        type:Date 
        }
    },
    twoStepVerification:{
        Otp:{
            type:String
        },
        expireAt:{
        type:Date 
        }
    },
    newEmail:String,
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
    enTSV:{
        type:Boolean,
        default:false
    },
    twoStepVerficationState:{
        type:Boolean,
        default:false 
    },
    Key:String,
    slug:String,
    deleteAt:Date,
    oldpasswords:[{
        type:String
    }],
    coverImages:[{
        type:String
    }],
    isCredentialUpdated:Date,
      

    extra:{name:String}
},
{
    timestamps:true,
    strictQuery:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }

}
)


/*userSchema.virtual('username').set(function(value:string){
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
 
});*/

/*userSchema.pre('save',async function (next) {
    console.log({
        PreSave:this,
        directModifiedPaths:this.directModifiedPaths(),
        isDirectModified:this.isDirectModified('extra.name'),
        isSelected:this.isSelected('extra.name'),
        isInited:this.isInit('firstName'),
        isInitedlastName:this.isInit('lastName')

    }); 
    
})*/

/*userSchema.pre('updateOne',{document:true,query:false},async function(next){
    console.log({this:this});

})
userSchema.pre(['findOne','find'],async function(next){
const query=this.getQuery()
console.log({
    this:this,
    query:query
})
if(query.paranoId===false){
    this.setQuery({...query})
}else{
    this.setQuery({...query,deletedAt:{$exists:false}})
}
const options=this.getOptions()
if(options.skip&&options.skip<0){
    this.setOptions({...options,skip:0})
}if(options.limit&&options.limit<=0){
    this.setOptions({...options,limit:5})
}

})

userSchema.pre('updateOne',async function (next) {
    const update=this.getUpdate()as UpdateQuery<HydratedDocument<IUser>>
    console.log({update})
    if(update.deleteAt){
        this.setUpdate({...update,isCredentialUpdated:new Date()})
    }
    if(update.password){
        const hashedPassword=hashText(update.password as string)
        this.setUpdate({...update,password:hashedPassword,confirmPassword:hashedPassword,isCredentialUpdated:new Date()})
    }
})

userSchema.pre('findOneAndUpdate',async function (next) {
    const update=this.getUpdate()as UpdateQuery<HydratedDocument<IUser>>
    console.log({update})
    if(update.deleteAt){
        this.setUpdate({...update,isCredentialUpdated:new Date()})
    }
    if(update.password){
        const hashedPassword=hashText(update.password as string)
        this.setUpdate({...update,password:hashedPassword,confirmPassword:hashedPassword,isCredentialUpdated:new Date()})
    }
    next()
})

userSchema.pre('insertMany',async function (next,docs) {
    console.log({
        this:this,
        docs:docs
    });
    
})

userSchema.post('insertMany',async function (docs,next) {
    console.log({
        this:this,
        docs:docs
    });
    next()
})*/

/*userSchema.pre('save',async function(this : HydratedDocument<IUser>& {firstCreation:boolean,plainTextOtp?:string},next){
this.firstCreation=this.isNew
this.plainTextOtp= this.emailOtp?.Otp
if(this.isModified('password')){
    this.password=hashText(this.password)
    this.confirmPassword=hashText(this.confirmPassword)
}
if(this.isModified('emailOtp.Otp')){
    this.emailOtp={
        Otp:hashText(this.emailOtp?.Otp ||''),
        expireAt:this.emailOtp?.expireAt as Date
    }
}

})


userSchema.post('save',async function(doc,next){
    const that=this as HydratedDocument<IUser>& {firstCreation:boolean,plainTextOtp?:string}
    console.log({isNew:that.firstCreation,plainTextOtp:that.plainTextOtp});
    if(that.firstCreation){
     emailEventEmitter.emit('confirmEmail', { email:that.email, firstName:that.firstName, otp:that.plainTextOtp });
    }
    next();
})

*/


export const userModel=model<IUser>('user',userSchema)