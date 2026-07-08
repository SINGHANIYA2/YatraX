import mongoose, { Schema,} from "mongoose";

const RouteSchema = new Schema(
        {
            geometry: [
                {
                    lat: Number,
                    lng: Number,
                },
            ],

            distanceInKm: {
                type: Number,
                default: 0,
            },

            estimatedDurationInMinutes: {
                type: Number,
                default: 0,
            },

            // Fare estimate for this route, computed at assignment time
            // based on distance (km) and the assigned vehicle's per-km rate.
            estimatedFare: {
                type: Number,
                default: 0,
            },

            farePerKm: {
                type: Number,
                default: 0,
            },

            isActive: {
                type: Boolean,
                default: true,
            },
            locations: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Location",
                    required: true,
                }
            ],
            adminId: {
                type: Schema.Types.ObjectId,
                ref: "Admin",
                required: true,
                index: true,
            }
        },
        {
            timestamps: true,
        }
    );

const Route =  mongoose.models.Route || mongoose.model("Route",RouteSchema);
export default Route
