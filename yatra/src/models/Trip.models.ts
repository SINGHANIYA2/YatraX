import mongoose, { Schema, Document, Types } from "mongoose";
import "./route.models";
import "./vehicle.models";
import "./location.models";
import "./Tripschedule.models";

export interface ITrip extends Document {
  scheduleId: Types.ObjectId | null; // null if this trip was created manually, not from a recurring schedule
  routeId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  adminId: Types.ObjectId;

  // Snapshot of the route's stops at generation time — deliberately NOT a
  // live reference-only lookup, so editing the Route later doesn't silently
  // reshuffle stops (and therefore segment indices/bookings) on trips that
  // already have passengers booked.
  stops: Types.ObjectId[]; // ordered Location ids, same order as Route.locations was at generation time

  scheduledDate: Date;        // calendar date this trip runs on (midnight, date-only)
  departureDateTime: Date;    // scheduledDate + schedule's departureTime
  arrivalDateTime: Date;      // departureDateTime + estimatedDurationInMinutes

  seatingCapacity: number;    // copied from Vehicle at generation time

  // One counter per gap between consecutive stops.
  // length === stops.length - 1
  // segmentOccupancy[i] = seats currently booked on the leg stops[i] -> stops[i+1]
  segmentOccupancy: number[];

  status: "scheduled" | "running" | "completed" | "cancelled";

  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "TripSchedule",
      default: null,
      index: true,
    },

    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
    },

    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true,
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    stops: [
      {
        type: Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
    ],

    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },

    departureDateTime: {
      type: Date,
      required: true,
    },

    arrivalDateTime: {
      type: Date,
      required: true,
    },

    seatingCapacity: {
      type: Number,
      required: true,
    },

    segmentOccupancy: {
      type: [Number],
      default: [],
    },

    status: {
      type: String,
      enum: ["scheduled", "running", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },
  },
  { timestamps: true }
);

// A schedule shouldn't generate two trips for the same calendar date.
TripSchema.index(
  { scheduleId: 1, scheduledDate: 1 },
  { unique: true, partialFilterExpression: { scheduleId: { $type: "objectId" } } }
);

const Trip = mongoose.models.Trip || mongoose.model<ITrip>("Trip", TripSchema);

export default Trip;