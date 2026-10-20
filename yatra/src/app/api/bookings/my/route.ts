import { auth } from "../../../../../src/auth";
import connectDb from "../../../../../src/lib/db";
import Booking from "../../../../../src/models/booking.models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await Booking.find({ userId: session.user.id })
      .populate({ path: "boardStopId", select: "name city" })
      .populate({ path: "alightStopId", select: "name city" })
      .populate({
        path: "tripId",
        select: "departureDateTime vehicleId",
        populate: { path: "vehicleId", select: "vehicleType brand model" },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
