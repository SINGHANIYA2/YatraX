import mongoose, { Schema } from "mongoose";
import { FileSchema } from "./FileSchema.models";

const VehicleSchema = new Schema({
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    assignedPartnerId: {
      type: Schema.Types.ObjectId,
      ref: "Partner",
      default: null,
      index: true,
    },

    vehicleType: {
      type: String,
      enum: ["bike", "auto", "cab", "bus"],
      required: true,
    },

<<<<<<< HEAD
    brand: String,

    model: String,
=======
    brand: {
      type: String,
      trim: true,
    },

    model: {
      type: String,
      trim: true,
    },
>>>>>>> 0e1d5da9ede71dacb0ec121eb87405de06a48285

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    documents: {
      rc: FileSchema,
      insurance: FileSchema,
      pollution: FileSchema,
    },

    status: {
      type: String,
      enum: [
        "available",
        "assigned",
        "maintenance",
      ],
      default: "available",
      index: true,
    },

    tripStatus: {
      type: String,
      enum: ["idle","boarding","running","completed",],
      default: "idle",
      index: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },

    currentLatitude: {
      type: Number,
      default: null,
    },

    currentLongitude: {
      type: Number,
      default: null,
    },

    speed: {
      type: Number,
      default: 0,
    },

    heading: {
      type: Number,
      default: 0,
    },

    lastLocationUpdate: {
      type: Date,
      default: null,
      index: true,
    },

    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },

<<<<<<< HEAD
    assignedAt: Date,

    scheduledStartAt: Date,

    scheduledEndAt: Date,

=======
    assignedAt: {
      type: Date,
      default: null,
    },
>>>>>>> 0e1d5da9ede71dacb0ec121eb87405de06a48285
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;