import mongoose, { Schema } from "mongoose";
import { FileSchema } from "./FileSchema.models";

const VehicleSchema = new Schema(
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },

        assignedPartnerId: {
            type: Schema.Types.ObjectId,
            ref: "Partner",
            default: null
        },

        vehicleType: {
            type: String,
            enum: ["bike", "auto", "car"],
            required: true
        },

        brand: String,

        model: String,

        vehicleNumber: {
            type: String,
            required: true,
            unique: true
        },

        documents: {
            rc: FileSchema,

            insurance: FileSchema,

            pollution: FileSchema,

            vehiclePhoto: FileSchema
        },

        status: {
            type: String,
            enum: [
                "available",
                "assigned",
                "maintenance"
            ],
            default: "available"
        },

        assignedAt: Date
    },
    {
        timestamps: true
    });

export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);