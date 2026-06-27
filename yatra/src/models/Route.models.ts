// import mongoose, { Schema,} from "mongoose";

// const RouteSchema = new Schema(
// {
//             name: {
//                 type: String,
//                 required: true,
//                 trim: true,
//             },

//             source: {
//                 type: Schema.Types.ObjectId,
//                 ref: "Location",
//                 required: true,
//                 index: true,
//             },

//             destination: {
//                 type: Schema.Types.ObjectId,
//                 ref: "Location",
//                 required: true,
//                 index: true,
//             },

//             stops: [
//                 {
//                     type: Schema.Types.ObjectId,
//                     ref: "Location",
//                 },
//             ],

//             geometry: [
//                 {
//                     lat: Number,
//                     lng: Number,
//                 },
//             ],

//             distanceInKm: {
//                 type: Number,
//                 default: 0,
//             },

//             estimatedDurationInMinutes: {
//                 type: Number,
//                 default: 0,
//             },

//             isActive: {
//                 type: Boolean,
//                 default: true,
//             },
//         },
//         {
//             timestamps: true,
//         }
//     );

// export default mongoose.models.Route || mongoose.model("Route",RouteSchema);


import mongoose, {
    Schema,
} from "mongoose";

const RouteSchema =
    new Schema(
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

export default mongoose.models.Route || mongoose.model("Route",  RouteSchema);