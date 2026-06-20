import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVehicle extends Document {
    partner: mongoose.Types.ObjectId;

    vehicleNumber: string;
    vehicleName: string;

    vehicleType:
    | "bus"
    | "auto"
    | "cab"
    | "tempo"
    | "mini_bus";

    totalSeats: number;
    availableSeats: number;

    rcDocument: string;
    insuranceDocument: string;
    permitDocument: string;

    vehicleImages: string[];

    status:
    | "active"
    | "inactive"
    | "maintenance";
}

const vehicleSchema = new Schema<IVehicle>(
    {
        partner: {
            type: Schema.Types.ObjectId,
            ref: "Partner",
            required: false,
        },


        vehicleNumber: {
            type: String,
            required: true,
            unique: true,
        },

        vehicleName: String,

        vehicleType: {
            type: String,
            enum: [
                "bus",
                "auto",
                "cab",
                "tempo",
                "mini_bus",
            ],
            required: true,
        },

        totalSeats: Number,

        availableSeats: Number,

        rcDocument: String,

        insuranceDocument: String,

        permitDocument: String,

        vehicleImages: [String],

        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "maintenance",
            ],
            default: "active",
        },


    },
    {
        timestamps: true,
    }
);

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;
