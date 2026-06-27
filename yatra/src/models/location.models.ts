<<<<<<< HEAD
import mongoose, { Schema, Document } from "mongoose";
=======
import mongoose, {Schema, Document} from "mongoose";
>>>>>>> origin/main

export interface ILocation extends Document {
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
<<<<<<< HEAD
  type: string;
=======
  type: string
>>>>>>> origin/main
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
<<<<<<< HEAD
      enum: ["region", "stop"],
      required: true,
=======
      enum: ["region", "stop"],//region -> admin , stop -> stopage
      required: true,
      default:"stop"
>>>>>>> origin/main
    },
    isActive: {
      type: Boolean,
      default: true,
    },
<<<<<<< HEAD
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
=======
  },{timestamps: true,}
);

const Location = mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);

export default Location;







>>>>>>> origin/main
