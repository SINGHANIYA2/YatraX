import mongoose, { Mongoose } from "mongoose"
import partnerApplicationModels from '@/models/partnerApplication.models';
import PartnerApplication from './partnerApplication.models';


export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    isEmailVerified?: boolean,
    isMobileVerified?: boolean,
    emailOtp: string
    mobileOtp: string
    otpExpiresAt?: Date
    mobilfied?: boolean;
    partnereNumber?: string
    isVeriApplication?: mongoose.Types.ObjectId;
    partnerStatus?: string
    mobileNumber:string
    partnerApplication:PartnerApplication
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "partner"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    emailOtp: {
        type: String
    },
    mobileOtp: {
        type: String
    },

    otpExpiresAt: {
        type: Date
        // default:null
    }, 
    mobileNumber: {
        type: String
    }, partnerApplication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PartnerApplication",
        default: null,
    },

    partnerStatus: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected",
        ],
        default: "pending",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true })
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User