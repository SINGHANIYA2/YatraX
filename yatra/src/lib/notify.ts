import "server-only";
import connectDb from "../../src/lib/db";
import Notification from "../../src/models/notification.models";
import { Types } from "mongoose";

// Small helper so any route can fire-and-forget a notification without
// repeating the boilerplate. Never throws — a failed notification should
// never break the booking/payment/approval flow that triggered it.
export async function createNotification({
  recipientId,
  recipientRole,
  title,
  message,
  type,
  link,
}: {
  recipientId: Types.ObjectId | string;
  recipientRole: "user" | "partner" | "admin";
  title: string;
  message: string;
  type?: "user" | "partner" | "admin";
  link?: string;
}) {
  try {
    await connectDb();
    await Notification.create({
      recipientId,
      recipientRole,
      title,
      message,
      type: type ?? recipientRole,
      link,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
