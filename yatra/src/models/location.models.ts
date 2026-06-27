import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  type: string;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["region", "stop"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }, { timestamps: true, }
);

const Location = mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);

export default Location;









// // models/location.model.ts

// import mongoose, { Schema, Document } from "mongoose";

// export interface ILocation extends Document {
//   name: string;
//   city: string;
//   state: string;
//   isActive: boolean;
// }

// const locationSchema = new Schema<ILocation>(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     city: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     state: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Location = mongoose.models.Location || mongoose.model<ILocation>("Location",locationSchema);

// export default Location