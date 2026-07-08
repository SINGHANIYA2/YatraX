import connectDb from "@/lib/db";
import Partner from "@/models/partner.models";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import Trip from "@/models/Trip.models";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "partner") {
      return NextResponse.json(
        { success: false, message: "Only partners have trips" },
        { status: 403 }
      );
    }

    const partner = await Partner.findOne({ userId: session.user.id });

    if (!partner || !partner.assignedVehicleId) {
      return NextResponse.json({ success: true, trips: [] }, { status: 200 });
    }

    const today = startOfDay(new Date());

    const trips = await Trip.find({
      vehicleId: partner.assignedVehicleId,
      scheduledDate: today,
      status: { $in: ["scheduled", "running"] },
    })
      .populate({ path: "stops", select: "name city" })
      .sort({ departureDateTime: 1 });

    const result = trips.map((trip: any) => {
      const totalSeats = trip.seatingCapacity;
      const maxOccupied = trip.segmentOccupancy.length
        ? Math.max(...trip.segmentOccupancy)
        : 0;

      return {
        tripId: trip._id,
        status: trip.status,
        stops: trip.stops.map((s: any) => s.name),
        departureDateTime: trip.departureDateTime,
        arrivalDateTime: trip.arrivalDateTime,
        seatingCapacity: totalSeats,
        seatsBooked: maxOccupied, // peak occupancy across the route, rough "how full is this trip" indicator
      };
    });

    return NextResponse.json({ success: true, trips: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}