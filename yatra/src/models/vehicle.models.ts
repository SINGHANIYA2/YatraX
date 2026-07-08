import mongoose, { Schema } from "mongoose";
import { FileSchema } from "./FileSchema.models";

import { Types, Document } from "mongoose";

export interface IFile {
  url: string;
  publicId: string;
  fileName?: string;
  fileType?: string;
}

export interface IVehicle extends Document {
  adminId: Types.ObjectId;

  assignedPartnerId: Types.ObjectId | null;

  vehicleType: "bike" | "auto" | "cab" | "bus";

  brand?: string;

  modelName?: string;

  vehicleNumber: string;

  documents: {
    rc?: IFile;
    insurance?: IFile;
    pollution?: IFile;
  };

  status: "available" | "assigned" | "maintenance";

  tripStatus: "idle" | "boarding" | "running" | "completed";

  isOnline: boolean;

  currentLatitude: number | null;

  currentLongitude: number | null;

  speed: number;

  heading: number;

  // Fixed pickup/drop points for this vehicle's route, e.g.
  // [[srcLat, srcLng], [destLat, destLng]]
  // NOTE: was `[[number]]` (tuple-of-1-tuples) — that's a different,
  // incorrect type. This is what you actually want.
  endPoints: [number, number][];

  lastLocationUpdate: Date | null;

  routeId: Types.ObjectId | null;

  scheduledStartAt?: Date;

  scheduledEndAt?: Date;

  assignedAt: Date | null;

  availableSeats: number;

  seatingCapacity: number;

  createdAt: Date;

  updatedAt: Date;
};


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

  brand: {
    type: String,
    trim: true,
  },

  model: {
    type: String,
    trim: true,
  },

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
    enum: ["idle", "boarding", "running", "completed",],
    default: "idle",
    index: true,
  },

  isOnline: {
    type: Boolean,
    default: false,
    index: true,
  },
  endPoints: {
    type: [[Number]],
    default: [],
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

  scheduledStartAt: Date,

  scheduledEndAt: Date,

  assignedAt: {
    type: Date,
    default: null,
  },

  availableSeats: {
    type: Number,
    required: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
},

  {
    timestamps: true,
  }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", VehicleSchema);

export default Vehicle;