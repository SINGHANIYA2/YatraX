// app/api/trip/[tripId]/complete/route.ts

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

    if (trip.status !== "running") {
      return NextResponse.json(
        { success: false, message: `Cannot complete a trip that is currently "${trip.status}"` },
        { status: 400 }
      );
    }

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

    trip.status = "completed";
    await trip.save();

    await Vehicle.updateOne({ _id: trip.vehicleId }, { tripStatus: "completed" });

    // TODO: this is a natural place to bump Partner.totalRides / completedRides
    // / totalDistance / lastRideAt, and increment earnings fields, once you're
    // ready to wire that up — left out here since it wasn't asked for yet.

    return NextResponse.json({ success: true, message: "Trip completed" }, { status: 200 });

  } 
  catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to complete trip" }, { status: 500 });
  }
}