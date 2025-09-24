import multer, { diskStorage, memoryStorage } from 'multer'
import { StoreIn} from '../../common/Enums/user.enum'
import { Request } from 'express'
import { ApplicationException } from '../Error'


export const fileTypes={
images:['image/jpg','image/jpeg','image/png','image/gif']
}


export const uploadFile=({storeIn=StoreIn.memory,type=fileTypes.images}:{storeIn?:StoreIn,type?:string[]}):multer.Multer=>{
const storage= storeIn ==StoreIn.memory ? memoryStorage():diskStorage({})
const fileFilter=(req:Request,file:Express.Multer.File,cb:CallableFunction)=>{
if(!type.includes(file.mimetype)){
    return cb(new ApplicationException('in-valid file format',400),false)
}

return cb(null,true)

}

return multer({storage,fileFilter})

}