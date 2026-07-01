import mongoose, { Schema } from "mongoose";

export const BookingSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        partnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Partner",
            required: true,
        },
        vehicleId: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        routeId: {
            type: Schema.Types.ObjectId,
            ref: "Route",
            required: true,
        },
        source: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },

        destination: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        fare: {
            type: Number,
            required: true,
        },

        seatsBooked: {
            type: Number,
            default: 1,
            min: 1,
        },
        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded",
            ],
            default: "pending",
        },
        rideStatus: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "started",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },
        bookedAt: {
            type: Date,
            default: Date.now,
        },
        startedAt: Date,

        completedAt: Date, scheduledStartAt: {
            type: Date,
            required: true,
        },

        scheduledEndAt: {
            type: Date,
            required: true,
        },

        actualStartAt: Date,

        actualEndAt: Date,

        cancelledAt: Date,

        cancellationReason: String,
    },
    {
        timestamps: true,
    }
)

export default mongoose.models.Booking ||
    mongoose.model("Booking", BookingSchema);