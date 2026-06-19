import mongoose from "mongoose"
import { number } from "motion"



interface IPartnerBank{
    owner:mongoose.Types.ObjectId
    accountHolder:string,
    accountNumber:string,
    ifsc:string,
    upi?:string,
    status: "not_added" | "added" | "verified"
    rejectionReason?:string
    isActive: boolean
    createdAt:Date
    updatedAt:Date
}

const PartnerBankSchema=new mongoose.Schema<IPartnerBank>({
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    accountHolder:{
        type:String,
        required:true,
    },
    accountNumber:{
        type:String,
        required:true,
        unique:true
    },
    ifsc:{
        type:String,
        required:true,
        uppercase:true
    },
    upi:String,
    status:{
        type:String,
        enum:["not_added" , "added" ,"verified"],
        default:"not_added"
    },
    rejectionReason:String,
    isActive:{
        type:Boolean,
        default:true
    },
   
},{timestamps:true})

const PartnerBank = mongoose.models.PartnerBank || mongoose.model("PartnerBank",PartnerBankSchema)

export default PartnerBank