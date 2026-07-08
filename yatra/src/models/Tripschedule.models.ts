import mongoose, { Schema, Document, Types } from "mongoose";
import "./route.models";
import "./vehicle.models";
import "./admin.models";

export interface ITripSchedule extends Document {
  adminId: Types.ObjectId;
  routeId: Types.ObjectId;
  vehicleId: Types.ObjectId;

  // "14:45" — 24hr HH:mm, kept as a string so it's timezone-neutral;
  // combined with a specific calendar date when a Trip is generated.
  departureTime: string;

  // Estimated duration used to derive arrival time per generated trip.
  // (Route already has estimatedDurationInMinutes — this can default from
  // that at creation time, or be overridden per schedule.)
  estimatedDurationInMinutes: number;

  // 0 = Sunday ... 6 = Saturday. Empty/omitted = runs every day.
  daysOfWeek: number[];

  isActive: boolean;

  // Optional window during which this schedule is in effect —
  // e.g. a seasonal route. Leave unset for "runs indefinitely".
  validFrom?: Date;
  validTill?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const TripScheduleSchema = new Schema<ITripSchedule>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
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

    departureTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // "HH:mm"
    },

    estimatedDurationInMinutes: {
      type: Number,
      required: true,
      default: 0,
    },

    daysOfWeek: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6], // runs every day unless restricted
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    validFrom: Date,
    validTill: Date,
  },
  { timestamps: true }
);

const TripSchedule = mongoose.models.TripSchedule || mongoose.model<ITripSchedule>("TripSchedule", TripScheduleSchema);

export default TripSchedule;