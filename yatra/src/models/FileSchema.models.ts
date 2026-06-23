import { Schema } from "mongoose";

export const FileSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    fileId: {
      type: String,
      required: true,
    },

    fileName: String,

    mimeType: String,

    size: Number,
  },
  {
    _id: false,
  }
);