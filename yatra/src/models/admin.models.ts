import mongoose, { Schema } from "mongoose";
import { FileSchema } from "./FileSchema.models";

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

  activeVehicles: {
    type: Number,
    default: 0,
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

  lastSeen: Date,
},
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;