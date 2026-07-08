import mongoose, { Schema, Document, Types } from "mongoose";
import "./Trip.models";
import "./location.models";

export interface IBookingPassenger {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface IBooking extends Document {
  tripId: Types.ObjectId;
  userId: Types.ObjectId;

  boardStopId: Types.ObjectId;
  alightStopId: Types.ObjectId;
  boardIndex: number;
  alightIndex: number;

  passengers: IBookingPassenger[];
  seatsBooked: number;

  distanceKm: number;
  farePerPassenger: number;
  totalFare: number;

  paymentMethod: "upi" | "card" | "wallet" | "netbanking";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";

  bookingStatus: "confirmed" | "cancelled";
  cancelledAt?: Date;
  cancellationReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    boardStopId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    alightStopId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    boardIndex: { type: Number, required: true },
    alightIndex: { type: Number, required: true },

    passengers: [
      {
        name: { type: String, required: true, trim: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ["male", "female", "other"], required: true },
      },
    ],

    seatsBooked: { type: Number, required: true },

    distanceKm: { type: Number, required: true },
    farePerPassenger: { type: Number, required: true },
    totalFare: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "wallet", "netbanking"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      index: true,
    },

    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;







// import mongoose, { Schema } from "mongoose";
// import { Document, Types } from "mongoose";

// export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// export type RideStatus = "pending" | "accepted" | "started" | "completed" | "cancelled";

// export interface IBooking extends Document {
//     userId: Types.ObjectId;

//     partnerId: Types.ObjectId;

//     vehicleId: Types.ObjectId;

//     routeId: Types.ObjectId;

//     source: Types.ObjectId;

//     destination: Types.ObjectId;

//     fare: number;

//     seatsBooked: number;

//     paymentStatus: PaymentStatus;

//     rideStatus: RideStatus;

//     bookedAt: Date;

//     startedAt?: Date;

//     completedAt?: Date;

//     scheduledStartAt: Date;

//     scheduledEndAt: Date;

//     actualStartAt?: Date;

//     actualEndAt?: Date;

//     cancelledAt?: Date;

//     cancellationReason?: string;

//     createdAt: Date;

//     updatedAt: Date;
// }
// export const BookingSchema = new Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         partnerId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Partner",
//             required: true,
//         },
//         vehicleId: {
//             type: Schema.Types.ObjectId,
//             ref: "Vehicle",
//             required: true,
//         },
//         routeId: {
//             type: Schema.Types.ObjectId,
//             ref: "Route",
//             required: true,
//         },
//         source: {
//             type: Schema.Types.ObjectId,
//             ref: "Location",
//             required: true,
//         },

//         destination: {
//             type: Schema.Types.ObjectId,
//             ref: "Location",
//             required: true,
//         },
//         fare: {
//             type: Number,
//             required: true,
//         },

//         seatsBooked: {
//             type: Number,
//             default: 1,
//             min: 1,
//         },
//         paymentStatus: {
//             type: String,
//             enum: [
//                 "pending",
//                 "paid",
//                 "failed",
//                 "refunded",
//             ],
//             default: "pending",
//         },
//         rideStatus: {
//             type: String,
//             enum: [
//                 "pending",
//                 "accepted",
//                 "started",
//                 "completed",
//                 "cancelled",
//             ],
//             default: "pending",
//         },
//         bookedAt: {
//             type: Date,
//             default: Date.now,
//         },
//         startedAt: Date,

//         completedAt: Date, scheduledStartAt: {
//             type: Date,
//             required: true,
//         },

//         scheduledEndAt: {
//             type: Date,
//             required: true,
//         },

//         actualStartAt: Date,

//         actualEndAt: Date,

//         cancelledAt: Date,

//         cancellationReason: String,
//     }, { timestamps: true, }
// )

// const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
// export default Booking