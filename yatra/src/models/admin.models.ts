import mongoose, { Schema, Document } from "mongoose";
import { FileSchema } from "./FileSchema.models";

import { IFile } from "./FileSchema.models";

interface IBankDetails {
  accountHolder?: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  upiId?: string;

}

export interface IAdmin extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  role: string
  otp: string
  // otpExpiresAt: Date

  emailVerificationStatus: boolean;
  mobileVerificationStatus: boolean;

  mobileOtpExpiresAt?: Date
  emailOtpExpiresAt?: Date

  profilePhoto?: IFile;

  organizationName?: string;
  organizationType?: string;
  gstNumber?: string;
  registrationNumber?: string;
  alternatePhone?: string;

  bankDetails?: IBankDetails;

  aadharNumber: string;
  panNumber: string;

  documents: {
    aadhar?: IFile;
    panCard?: IFile;
  };
}


const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  organizationName: {
    type: String,
    default: "",
    trim: true,
  },

  organizationType: {
    type: String,
    default: "",
    trim: true,
  },

  gstNumber: {
    type: String,
    default: "",
    trim: true,
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin"],
  },

  registrationNumber: {
    type: String,
    default: "",
    trim: true,
  },

  alternatePhone: {
    type: String,
    default: "",
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePhoto: FileSchema,


  aadharNumber: {
    type: String,
    default: "",
  },

  panNumber: {
    type: String,
    default: "",
  },

  documents: {
    aadharFront: FileSchema,
    aadharBack: FileSchema,
    panCard: FileSchema,
  },
  mobileOtpExpiresAt: {
    type: Date
    // default:null
  },
  emailOtpExpiresAt: {
    type: Date
    // default:null
  },

  address: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  state: {
    type: String,
    default: "",
  },

  pincode: {
    type: String,
    default: "",
  },


  standName: {
    type: String,
    default: "",
  },

  standAddress: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: ""
  },
  otpExpiresAt: {
    type: Date
  },

  standLatitude: Number,

  standLongitude: Number,

  locations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
  ],

  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    ifsc: String,
    bankName: String,
    upiId: String,
  },

  pendingPartnerRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Partner",
    },
  ],

  approvedPartners: [
    {
      type: Schema.Types.ObjectId,
      ref: "Partner",
    },
  ],

  rejectedPartners: [
    {
      type: Schema.Types.ObjectId,
      ref: "Partner",
    },
  ],

  vehicles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  ],

  totalPartners: {
    type: Number,
    default: 0,
  },

  activePartners: {
    type: Number,
    default: 0,
  },

  totalVehicles: {
    type: Number,
    default: 0,
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },

  activeVehicles: {
    type: Number,
    default: 0,
  },
  emailOtp: {
    type: String,
    default: ""
  },
  mobileOtp: {
    type: String,
    default: ""
  },
  totalTrips: {
    type: Number,
    default: 0,
  },

  totalEarnings: {
    type: Number,
    default: 0,
  },


  isAvailable: {
    type: Boolean,
    default: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },
  emailVerificationStatus: {
    type: Boolean,
    default: false
  },
  mobileVerificationStatus: {
    type: Boolean,
    default: false
  },


  lastSeen: Date,
},
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;