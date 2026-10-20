import mongoose, { Schema, Document, Types } from "mongoose";

// Generic, role-agnostic notification. `recipientId` points at whichever
// collection `recipientRole` says (User / Partner / Admin) — Mongoose
// doesn't enforce the ref dynamically, application code always queries
// with both recipientId + recipientRole together so it's unambiguous.
export interface INotification extends Document {
  recipientId: Types.ObjectId;
  recipientRole: "user" | "partner" | "admin";

  title: string;
  message: string;
  type: "user" | "partner" | "admin";

  link?: string;
  read: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ["user", "partner", "admin"],
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["user", "partner", "admin"],
      default: "user",
    },

    link: { type: String },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

NotificationSchema.index({ recipientId: 1, recipientRole: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
