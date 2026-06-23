import mongoose, { Schema } from "mongoose";
import { FileSchema } from "./FileSchema.models";

const PartnerSchema = new Schema({
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

    assignedVehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },

    

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
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


    currentLatitude: Number,

    currentLongitude: Number,

    lastSeen: Date,

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

const Partner = mongoose.models.Partner || mongoose.model("Partner", PartnerSchema);
export default Partner