// app/api/trip/search/route.ts
//
// GET /api/trip/search?source=Ranchi&destination=Gaya&date=2026-07-10
//
// Finds trips whose stop list contains BOTH the source and destination
// (matched loosely by city/name), in the correct order, running on the
// given date, with at least 1 seat free across every segment the
// passenger would actually occupy (not the trip's total capacity).

import connectDb from "@/lib/db";
import Trip from "@/models/Trip.models";
import Location from "@/models/location.models";
import Vehicle from "@/models/vehicle.models";
import { haversineKm, calcFarePerPassenger } from "@/lib/fare";
import { NextRequest, NextResponse } from "next/server";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const source = req.nextUrl.searchParams.get("source");
    const destination = req.nextUrl.searchParams.get("destination");
    const dateParam = req.nextUrl.searchParams.get("date");

    if (!source || !destination) {
      return NextResponse.json(
        { success: false, message: "source and destination are required" },
        { status: 400 }
      );
    }

    // Resolve loose city/name text into actual Location documents.
    // A city can have multiple stops (e.g. several bus stands in Ranchi),
    // so this can match more than one Location per side.
    const [sourceLocations, destLocations] = await Promise.all([
      Location.find({
        isActive: true,
        $or: [
          { name: { $regex: source, $options: "i" } },
          { city: { $regex: source, $options: "i" } },
        ],
      }),
      Location.find({
        isActive: true,
        $or: [
          { name: { $regex: destination, $options: "i" } },
          { city: { $regex: destination, $options: "i" } },
        ],
      }),
    ]);

    if (sourceLocations.length === 0 || destLocations.length === 0) {
      return NextResponse.json(
        { success: true, count: 0, trips: [], message: "No matching stops found" },
        { status: 200 }
      );
    }

    const sourceIds = sourceLocations.map((l) => l._id.toString());
    const destIds = destLocations.map((l) => l._id.toString());

    // Date filter — defaults to today if not supplied
    const targetDate = startOfDay(dateParam ? new Date(dateParam) : new Date());

    const trips = await Trip.find({
      scheduledDate: targetDate,
      status: "scheduled",
      stops: { $in: [...sourceIds, ...destIds] }, // cheap pre-filter before the JS pass below
    })
      .populate({ path: "vehicleId", select: "vehicleType brand model" })
      .populate({ path: "stops", select: "name city latitude longitude" });

    const results: any[] = [];

    for (const trip of trips) {
      const stopIds = trip.stops.map((s: any) => s._id.toString());

      // Find the first matching source stop and the first matching
      // destination stop that comes AFTER it in this trip's stop order.
      const boardIndex = stopIds.findIndex((id: string) => sourceIds.includes(id));
      if (boardIndex === -1) continue;

      const alightIndex = stopIds.findIndex(
        (id: string, idx: number) => idx > boardIndex && destIds.includes(id)
      );
      if (alightIndex === -1) continue; // destination isn't reachable after this board point on this trip

      // Seats available for this passenger = the MINIMUM free seats across
      // every segment they'd occupy, not the trip's total capacity.
      const segmentsUsed = trip.segmentOccupancy.slice(boardIndex, alightIndex);
      const availableSeats = Math.min(
        ...segmentsUsed.map((occupied: number) => trip.seatingCapacity - occupied)
      );

      if (availableSeats <= 0) continue; // fully booked for this segment range

      const boardStop = trip.stops[boardIndex];
      const alightStop = trip.stops[alightIndex];

      const distanceKm =
        Math.round(
          haversineKm(
            [boardStop.latitude, boardStop.longitude],
            [alightStop.latitude, alightStop.longitude]
          ) * 10
        ) / 10;

      const vehicle = trip.vehicleId as any;
      const farePerPassenger = calcFarePerPassenger(vehicle.vehicleType, distanceKm);

      results.push({
        tripId: trip._id,
        vehicleType: vehicle.vehicleType,
        iconKey: vehicle.vehicleType,
        brand: vehicle.brand,
        model: vehicle.model,
        boardStopId: boardStop._id,
        boardStopName: boardStop.name,
        alightStopId: alightStop._id,
        alightStopName: alightStop.name,
        boardIndex,
        alightIndex,
        departureDateTime: trip.departureDateTime,
        arrivalDateTime: trip.arrivalDateTime,
        distanceKm,
        farePerPassenger,
        availableSeats,
      });
    }

    return NextResponse.json(
      { success: true, count: results.length, trips: results },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to search trips" },
      { status: 500 }
    );
  }
}