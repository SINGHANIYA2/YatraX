import { Schema, InferSchemaType } from "mongoose";

export interface IFile {
  url: string;
  fileId: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
}
export const FileSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    fileId: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      default: "",
      trim: true,
    },

    mimeType: {
      type: String,
      default: "",
      trim: true,
    },

    size: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);


// Or, instead of the interface above, you can use:
// export type IFile = InferSchemaType<typeof FileSchema>;