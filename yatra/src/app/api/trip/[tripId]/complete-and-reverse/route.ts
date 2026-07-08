// app/api/trip/[tripId]/complete-and-reverse/route.ts
//
// Single action for the partner: "I've reached the destination — complete
// this trip AND start the return journey on the same route, reversed."
//
// Reversing just means flipping the `stops` array — Trip.stops is already
// a snapshot (see trip.models.ts), so no Route lookup/edit is needed.

import connectDb from "@/lib/db";
import Trip from "@/models/trip.models";
import Vehicle from "@/models/vehicle.models";
import Partner from "@/models/partner.models";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

async function notifySocketServer(vehicleId: string, tripId: string | null, status: string) {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/internal/trip-status`,
      { vehicleId, tripId, status },
      { headers: { "x-internal-secret": process.env.INTERNAL_SECRET } }
    );
  } catch (err) {
    // Don't fail the whole request just because the real-time relay
    // failed — the DB state is still correct, clients just won't get
    // the instant push and will need to poll/refresh instead.
    console.log("Failed to notify socket server:", err);
  }
}

export async function POST(req: NextRequest,{ params }: { params: Promise<{ tripId: string }> }){
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

    // Ownership check — same as the plain start/complete routes
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

    // 1. Complete the outbound trip
    trip.status = "completed";
    await trip.save();

    // 2. Build the return trip — same vehicle/route/admin, stops reversed
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const durationMs = trip.arrivalDateTime.getTime() - trip.departureDateTime.getTime();
    const reversedStops = [...trip.stops].reverse();

    const returnTrip = await Trip.create({
      scheduleId: null, // ad-hoc, not generated from a recurring TripSchedule
      routeId: trip.routeId,
      vehicleId: trip.vehicleId,
      adminId: trip.adminId,
      stops: reversedStops,
      // scheduledDate must be normalized to midnight to match how
      // /api/trip/search queries it (startOfDay(...) equality) — using
      // the raw `now` here would make this trip permanently unsearchable.
      scheduledDate: startOfToday,
      departureDateTime: now, // bus is already there, departs immediately
      arrivalDateTime: new Date(now.getTime() + durationMs),
      seatingCapacity: trip.seatingCapacity,
      segmentOccupancy: new Array(Math.max(reversedStops.length - 1, 0)).fill(0),
      status: "running", // starts immediately — this IS the "start" action for the return leg
    });

    // 3. Sync Vehicle's live tripStatus
    await Vehicle.updateOne({ _id: trip.vehicleId }, { tripStatus: "running" });

    // 4. Notify the socket server so trackers watching this vehicle switch
    //    over to the new trip in real time, without waiting for a refresh.
    await notifySocketServer(trip.vehicleId.toString(), null, "completed");
    await notifySocketServer(
      trip.vehicleId.toString(),
      returnTrip._id.toString(),
      "running"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Trip completed, return trip started",
        returnTripId: returnTrip._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to complete trip and start return" },
      { status: 500 }
    );
  }
}