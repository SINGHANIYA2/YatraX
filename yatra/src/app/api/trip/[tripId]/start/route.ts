// app/api/trip/[tripId]/start/route.ts

import connectDb from "@/lib/db";
import Trip from "@/models/Trip.models";
import Vehicle from "@/models/vehicle.models";
import Partner from "@/models/partner.models";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { tripId } = await params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    }

    if (trip.status !== "scheduled") {
      return NextResponse.json(
        { success: false, message: `Cannot start a trip that is currently "${trip.status}"` },
        { status: 400 }
      );
    }

    // Only the partner assigned to this trip's vehicle (or an admin) can start it.
    if (session.user.role === "partner") {
      const partner = await Partner.findOne({ userId: session.user.id });
      if (!partner || partner.assignedVehicleId?.toString() !== trip.vehicleId.toString()) {
        return NextResponse.json(
          { success: false, message: "You are not assigned to this trip's vehicle" },
          { status: 403 }
        );
      }
    } else if (session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    trip.status = "running";
    await trip.save();

    // Reflect the same status on the vehicle's live tripStatus, since your
    // tracking map (SearchMap.tsx) and search endpoints read from Vehicle too.
    await Vehicle.updateOne({ _id: trip.vehicleId }, { tripStatus: "running" });

    return NextResponse.json({ success: true, message: "Trip started" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to start trip" }, { status: 500 });
  }
}