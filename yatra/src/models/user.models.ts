import mongoose , {Mongoose} from "mongoose"
import partnerApplicationModels from '@/models/partnerApplication.models';


export interface IUser extends Document{
    name:string;
    email:string;
    password?:string;
    createdAt:Date;
    updatedAt:Date;
    role:string;
    isEmailVerified?:boolean,
    isMobileVerified?:boolean,
    emailOtp:string
    mobileOtp:string
    otpExpiresAt?:Date
    mobileNumber?:string
    isVerified?: boolean;
    partnerApplication?:number,
    partnerStatus?:string
    
}

const userSchema=new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    partnerApplication:{
        type:Number,
        default:0
    },
    role:{
        type:String,
        default:"user",
        enum:["user","partner","admin"]
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isMobileVerified:{
        type:Boolean,
        default:false
    },
    emailOtp:{
        type:String
    },
    mobileOtp:{
        type:String
    },
    
    otpExpiresAt:{
        type:Date
        // default:null
    },mobileNumber:{
        type:String
    },partnerStatus:{
        type:String,
        enum : ["pending" ,"success"],
        default : "pending" 
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    
},{timestamps:true})
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User