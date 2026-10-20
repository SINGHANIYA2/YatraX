import { auth } from "../../../../src/auth";
import connectDb from "../../../../src/lib/db";
import Notification from "../../../../src/models/notification.models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const recipientRole = session.user.role as "user" | "partner" | "admin";

    const notifications = await Notification.find({
      recipientId: session.user.id,
      recipientRole,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipientId: session.user.id,
      recipientRole,
      read: false,
    });

    return NextResponse.json(
      { success: true, notifications, unreadCount },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
