import { auth } from "../../../../../src/auth";
import connectDb from "../../../../../src/lib/db";
import Notification from "../../../../../src/models/notification.models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
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
    const { notificationId } = await req.json().catch(() => ({ notificationId: undefined }));

    const filter: Record<string, unknown> = {
      recipientId: session.user.id,
      recipientRole,
    };

    if (notificationId) {
      filter._id = notificationId;
    }

    await Notification.updateMany(filter, { $set: { read: true } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
