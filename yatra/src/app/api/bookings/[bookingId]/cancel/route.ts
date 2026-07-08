// app/api/booking/[bookingId]/cancel/route.ts

import connectDb from "@/lib/db";
import Booking from "@/models/booking.models";
import Trip from "@/models/Trip.models";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest,{ params }: { params: Promise<{ bookingId: string }> }) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // Only the booking's own user (or an admin) can cancel it.
    if (booking.userId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Not your booking" }, { status: 403 });
    }

    if (booking.bookingStatus === "cancelled") {
      return NextResponse.json(
        { success: false, message: "Booking already cancelled" },
        { status: 400 }
      );
    }

    // Release the seats this booking held, back onto the trip's segments.
    const segmentIndices = Array.from(
      { length: booking.alightIndex - booking.boardIndex },
      (_, i) => booking.boardIndex + i
    );

    const releaseInc: Record<string, number> = {};
    for (const i of segmentIndices) {
      releaseInc[`segmentOccupancy.${i}`] = -booking.seatsBooked;
    }

    await Trip.updateOne({ _id: booking.tripId }, { $inc: releaseInc });

    booking.bookingStatus = "cancelled";
    booking.cancelledAt = new Date();
    booking.paymentStatus = booking.paymentStatus === "paid" ? "refunded" : "failed";
    await booking.save();

    return NextResponse.json(
      { success: true, message: "Booking cancelled, seats released" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}