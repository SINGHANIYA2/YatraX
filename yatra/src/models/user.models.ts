import mongoose , {Mongoose} from "mongoose"
import { userAgent } from "next/server";

export interface IUser extends Document{
    name:string;
    email:string;
    password?:string;
    createdAt:Date;
    updatedAt:Date;
    role:string;
    isEmailVerified?:boolean,
    partnerOnboardingSteps:number,
    otp?:string,
    otpExpiresAt?:Date
    mobileNumber?:string
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
    partnerOnboardingSteps:{
        type:Number,
        min:0,
        max:8,
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
    otp:{
        type:String
    },
    otpExpiresAt:{
        type:Date,
        // default:null
    },mobileNumber:{
        type:String
    }

   
},{timestamps:true})
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User