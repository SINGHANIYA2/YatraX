import mongoose, {Schema,Document,Types,} from "mongoose";
import {FileSchema,IFile,} from "./FileSchema.models";
import "./admin.models";
import "./location.models";
import "./vehicle.models";

export interface IPartner extends Document {
  userId: Types.ObjectId;
  applicationId?: Types.ObjectId;
  adminId: Types.ObjectId;
  locationId: Types.ObjectId;
  assignedVehicleId?: Types.ObjectId | null;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;

  name: string;
  phone: string;
  email: string;
  role: string;

  dob?: Date;
  gender?: "male" | "female" | "other";

  profilePhoto?: IFile;

  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  dlNumber: string;
  experience: number;
  aadharNumber?: string;

  documents: {
    aadharFront?: IFile;
    aadharBack?: IFile;
    drivingLicense?: IFile;
    profilePhoto?: IFile;
  };

  bankDetails: {
    accountHolder?: string;
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
    upiId?: string;
  };

  applicationStatus: "pending" | "approved" | "rejected" | "suspended";

  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;

  isOnline: boolean;
  isAvailable: boolean;
  isBlocked: boolean;
  isVerified: boolean;

  socketId?: string | null;
  lastSeen?: Date;

  emailVerificationStatus: boolean;
  mobileVerificationStatus: boolean;

  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalDistance: number;

  averageRating: number;
  totalRatings: number;

  totalEarned: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  walletBalance: number;
  withdrawnAmount: number;

  joinedAt?: Date;
  lastRideAt?: Date;

  emailOtp: string
  mobileOtp: string
  otpExpiresAt: Date

  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "PartnerApplication",
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    emailOtp: {
      type: String,
      default: ""
    },
    mobileOtp: {
      type: String,
      default: ""
    },
    otpExpiresAt: {
      type: Date
    },
    assignedVehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["partner"],
      default: "partner",
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    profilePhoto: FileSchema,

    emergencyContact: String,

    address: String,

    city: String,

    state: String,

    pincode: String,

    dlNumber: {
      type: String,
      required: true,
      unique: true,
    },


    experience: {
      type: Number,
      default: 0,
    },

    aadharNumber: String,

    documents: {
      aadharFront: FileSchema,
      aadharBack: FileSchema,
      drivingLicense: FileSchema,
      profilePhoto: FileSchema,
    },

    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      ifsc: String,
      bankName: String,
      upiId: String,
    },

    emailVerificationStatus: {
      type: Boolean,
      default: false
    },
    mobileVerificationStatus: {
      type: Boolean,
      default: false
    },

    applicationStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "suspended",
      ],
      default: "pending",
    },

    approvedAt: Date,

    rejectedAt: Date,

    rejectionReason: String,

    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },

    socketId: {
      type: String,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    totalRides: {
      type: Number,
      default: 0,
    },

    completedRides: {
      type: Number,
      default: 0,
    },

    cancelledRides: {
      type: Number,
      default: 0,
    },

    totalDistance: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    totalEarned: {
      type: Number,
      default: 0,
    },

    todayEarnings: {
      type: Number,
      default: 0,
    },

    weeklyEarnings: {
      type: Number,
      default: 0,
    },

    monthlyEarnings: {
      type: Number,
      default: 0,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    withdrawnAmount: {
      type: Number,
      default: 0,
    },

    joinedAt: Date,

    lastRideAt: Date,
  },
  {
    timestamps: true,
  }
);

const Partner = mongoose.models.Partner || mongoose.model<IPartner>("Partner", PartnerSchema);

export default Partner;