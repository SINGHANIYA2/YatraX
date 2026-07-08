// socketServer/models/trip.js
//
// Minimal mirror of the Next.js Trip schema. This is a SEPARATE Node
// process from your Next.js app, so it can't import the Next.js model
// file directly — it needs its own mongoose model pointed at the same
// "trips" collection. Keep this in sync manually if the Next.js schema
// changes shape.

import mongoose, { Schema } from "mongoose";

const TripSchema = new Schema(
  {
    scheduleId: { type: Schema.Types.ObjectId, default: null },
    routeId: { type: Schema.Types.ObjectId, required: true },
    vehicleId: { type: Schema.Types.ObjectId, required: true, index: true },
    adminId: { type: Schema.Types.ObjectId, required: true },
    stops: [{ type: Schema.Types.ObjectId }],
    scheduledDate: { type: Date, required: true },
    departureDateTime: { type: Date, required: true },
    arrivalDateTime: { type: Date, required: true },
    seatingCapacity: { type: Number, required: true },
    segmentOccupancy: { type: [Number], default: [] },
    status: {
      type: String,
      enum: ["scheduled", "running", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const Trip = mongoose.models.Trip || mongoose.model("Trip", TripSchema);

export default Trip;