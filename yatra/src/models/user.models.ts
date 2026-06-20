import mongoose , {Mongoose} from "mongoose"


export interface IUser extends Document{
    name:string;
    email:string;
    password?:string;
    createdAt:Date;
    updatedAt:Date;
    role:string;
    isEmailVerified?:boolean,
    isMobileVerified?:boolean,
    partnerOnboardingSteps:number,
    emailOtp:string
    mobileOtp:string
    otpExpiresAt?:Date
    mobileNumber?:string
    isVerified?: boolean;
    
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
    },
    isVerified: {
  type: Boolean,
  default: false,
},
   
},{timestamps:true})
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User