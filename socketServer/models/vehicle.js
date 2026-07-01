import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    assignedPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
    },

    isOnline: Boolean,

    currentLatitude: Number,
    currentLongitude: Number,
    speed: Number,
    heading: Number,
    lastLocationUpdate: Date,
  },
  {
    collection: "vehicles",
  }
);

const Vehicle =
  mongoose.models.Vehicle ||
  mongoose.model(
    "Vehicle",
    VehicleSchema
  );

export default Vehicle;