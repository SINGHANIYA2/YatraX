import mongoose, { Schema } from "mongoose";
import { FileSchema } from "./FileSchema.models";
import partnerApplicationModels from '@/models/partnerApplication.models';



const PartnerApplicationSchema = new Schema(
  {
    // Relations
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
      index: true,
    },

    partnerId: {
      type: Schema.Types.ObjectId,
      ref: "Partner",
      default: null,
    },

    // Personal Details
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    profilePhoto: FileSchema,

    // Driver Details
    dlNumber: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    emergencyContact: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: String,

    state: String,

    pincode: String,

    aadharNumber: String,

    // Documents
    documents: {
      aadharFront: {
        type: FileSchema,
        required: true,
      },

      aadharBack: {
        type: FileSchema,
        required: true,
      },

      drivingLicense: {
        type: FileSchema,
        required: true,
      },
    },
    // Bank Details
    bankDetails: {
      accountHolder: {
        type: String,
        required: true,
      },

      accountNumber: {
        type: String,
        required: true,
      },

      ifsc: {
        type: String,
        required: true,
      },

      bankName: {
        type: String,
        required: true,
      },

      upiId: String,
    },

    // Verification
    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    rejectionReason: String,

    remarks: String,

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PartnerApplication = mongoose.models.PartnerApplication || mongoose.model("PartnerApplication",PartnerApplicationSchema);
export default PartnerApplication