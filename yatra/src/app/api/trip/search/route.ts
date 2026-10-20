// // app/api/trip/search/route.ts
// //
// // GET /api/trip/search?source=Ranchi&destination=Gaya&date=2026-07-10
// //
// // Finds trips whose stop list contains BOTH the source and destination
// // (matched loosely by city/name), in the correct order, running on the
// // given date, with at least 1 seat free across every segment the
// // passenger would actually occupy (not the trip's total capacity).

// import connectDb from "@/lib/db";
// import Trip from "@/models/Trip.models";
// import TripSchedule from "@/models/Tripschedule.models";
// import Route from "@/models/route.models";
// import Vehicle from "@/models/vehicle.models";
// import Location from "@/models/location.models";
// import { haversineKm, calcFarePerPassenger } from "@/lib/fare";
// import { NextRequest, NextResponse } from "next/server";

// function startOfDay(date: Date): Date {
//   const d = new Date(date);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// function combineDateAndTime(date: Date, hhmm: string): Date {
//   const [hours, minutes] = hhmm.split(":").map(Number);
//   const combined = new Date(date);
//   combined.setHours(hours, minutes, 0, 0);
//   return combined;
// }

// // Search used to only ever look at already-generated Trip documents, which
// // meant nothing showed up for a date unless someone had separately hit
// // /api/corn/generate-trips for it (a cron the admin has to remember to run).
// // Instead of relying on that, search now self-heals: for the requested
// // date, it checks every active TripSchedule that actually runs on that
// // weekday and creates the matching Trip on the fly if it doesn't exist yet
// // — same logic as the generator job, just scoped to one date instead of a
// // rolling 3-day window. The cron/manual trigger still works too (it'll
// // just find these already exist and skip them).
// async function ensureTripsExistForDate(targetDate: Date) {
//   const weekday = targetDate.getDay(); // 0-6

//   const schedules = await TripSchedule.find({
//     isActive: true,
//     daysOfWeek: weekday,
//   });

//   for (const schedule of schedules) {
//     if (schedule.validFrom && targetDate < startOfDay(schedule.validFrom)) continue;
//     if (schedule.validTill && targetDate > startOfDay(schedule.validTill)) continue;

//     const route = await Route.findById(schedule.routeId);
//     const vehicle = await Vehicle.findById(schedule.vehicleId);
//     if (!route || !vehicle) continue;

//     const stops = route.locations;
//     const departureDateTime = combineDateAndTime(targetDate, schedule.departureTime);
//     const duration = schedule.estimatedDurationInMinutes || route.estimatedDurationInMinutes || 0;
//     const arrivalDateTime = new Date(departureDateTime.getTime() + duration * 60_000);

//     // Upsert instead of find-then-create so two simultaneous searches for
//     // the same date can't race and create duplicate trips.
//     await Trip.findOneAndUpdate(
//       { scheduleId: schedule._id, scheduledDate: targetDate },
//       {
//         $setOnInsert: {
//           scheduleId: schedule._id,
//           routeId: schedule.routeId,
//           vehicleId: schedule.vehicleId,
//           adminId: schedule.adminId,
//           stops,
//           scheduledDate: targetDate,
//           departureDateTime,
//           arrivalDateTime,
//           seatingCapacity: vehicle.seatingCapacity,
//           segmentOccupancy: new Array(Math.max(stops.length - 1, 0)).fill(0),
//           status: "scheduled",
//         },
//       },
//       { upsert: true, new: true }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     await connectDb();

//     const source = req.nextUrl.searchParams.get("source");
//     const destination = req.nextUrl.searchParams.get("destination");
//     const dateParam = req.nextUrl.searchParams.get("date");

//     if (!source || !destination) {
//       return NextResponse.json(
//         { success: false, message: "source and destination are required" },
//         { status: 400 }
//       );
//     }

//     // Resolve loose city/name text into actual Location documents.
//     // A city can have multiple stops (e.g. several bus stands in Ranchi),
//     // so this can match more than one Location per side.
//     const [sourceLocations, destLocations] = await Promise.all([
//       Location.find({
//         isActive: true,
//         $or: [
//           { name: { $regex: source, $options: "i" } },
//           { city: { $regex: source, $options: "i" } },
//         ],
//       }),
//       Location.find({
//         isActive: true,
//         $or: [
//           { name: { $regex: destination, $options: "i" } },
//           { city: { $regex: destination, $options: "i" } },
//         ],
//       }),
//     ]);

//     if (sourceLocations.length === 0 || destLocations.length === 0) {
//       return NextResponse.json(
//         { success: true, count: 0, trips: [], message: "No matching stops found" },
//         { status: 200 }
//       );
//     }

//     const sourceIds = sourceLocations.map((l) => l._id.toString());
//     const destIds = destLocations.map((l) => l._id.toString());

//     // Date filter — defaults to today if not supplied
//     const targetDate = startOfDay(dateParam ? new Date(dateParam) : new Date());

//     // Auto-create any recurring trips scheduled to run on this date/weekday
//     // that don't exist yet — see ensureTripsExistForDate() above.
//     await ensureTripsExistForDate(targetDate);

//     const trips = await Trip.find({
//       scheduledDate: targetDate,
//       status: "scheduled",
//       stops: { $in: [...sourceIds, ...destIds] }, // cheap pre-filter before the JS pass below
//     })
//       .populate({ path: "vehicleId", select: "vehicleType brand model" })
//       .populate({ path: "stops", select: "name city latitude longitude" });

//     const results: any[] = [];

//     for (const trip of trips) {
//       const stopIds = trip.stops.map((s: any) => s._id.toString());

//       // Find the first matching source stop and the first matching
//       // destination stop that comes AFTER it in this trip's stop order.
//       const boardIndex = stopIds.findIndex((id: string) => sourceIds.includes(id));
//       if (boardIndex === -1) continue;

//       const alightIndex = stopIds.findIndex(
//         (id: string, idx: number) => idx > boardIndex && destIds.includes(id)
//       );
//       if (alightIndex === -1) continue; // destination isn't reachable after this board point on this trip

//       // Seats available for this passenger = the MINIMUM free seats across
//       // every segment they'd occupy, not the trip's total capacity.
//       const segmentsUsed = trip.segmentOccupancy.slice(boardIndex, alightIndex);
//       const availableSeats = Math.min(
//         ...segmentsUsed.map((occupied: number) => trip.seatingCapacity - occupied)
//       );

//       if (availableSeats <= 0) continue; // fully booked for this segment range

//       const boardStop = trip.stops[boardIndex];
//       const alightStop = trip.stops[alightIndex];

//       const distanceKm =
//         Math.round(
//           haversineKm(
//             [boardStop.latitude, boardStop.longitude],
//             [alightStop.latitude, alightStop.longitude]
//           ) * 10
//         ) / 10;

//       const vehicle = trip.vehicleId as any;
//       const farePerPassenger = calcFarePerPassenger(vehicle.vehicleType, distanceKm);

//       results.push({
//         tripId: trip._id,
//         vehicleType: vehicle.vehicleType,
//         iconKey: vehicle.vehicleType,
//         brand: vehicle.brand,
//         model: vehicle.model,
//         boardStopId: boardStop._id,
//         boardStopName: boardStop.name,
//         alightStopId: alightStop._id,
//         alightStopName: alightStop.name,
//         boardIndex,
//         alightIndex,
//         departureDateTime: trip.departureDateTime,
//         arrivalDateTime: trip.arrivalDateTime,
//         distanceKm,
//         farePerPassenger,
//         availableSeats,
//       });
//     }

//     return NextResponse.json(
//       { success: true, count: results.length, trips: results },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { success: false, message: "Failed to search trips" },
//       { status: 500 }
//     );
//   }
// }

// app/api/trip/search/route.ts
//
// GET /api/trip/search?source=Ranchi&destination=Gaya&date=2026-07-10
//
// Finds trips whose stop list contains BOTH the source and destination
// (matched loosely by city/name), in the correct order, running on the
// given date, with at least 1 seat free across every segment the
// passenger would actually occupy (not the trip's total capacity).

// app/api/trip/search/route.ts
//
// GET /api/trip/search?source=Ranchi&destination=Gaya&date=2026-07-10
//
// Finds trips whose stop list contains BOTH the source and destination
// (matched loosely by city/name), in the correct order, running on the
// given date, with at least 1 seat free across every segment the
// passenger would actually occupy (not the trip's total capacity).

import mongoose from "mongoose";
import connectDb from "../../../../lib/db";
import Trip from "../../../../models/Trip.models";
import TripSchedule from "../../../../models/Tripschedule.models";
import Route from "../../../../models/route.models";
import Vehicle from "../../../../models/vehicle.models";
import Location from "../../../../models/location.models";
import { haversineKm, calcFarePerPassenger } from "../../../../lib/fare";
import { NextRequest, NextResponse } from "next/server";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function combineDateAndTime(date: Date, hhmm: string): Date {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

// Pulls a usable ObjectId-ish value out of a field that SHOULD be a plain
// ObjectId but may have been hand-inserted wrong via a DB GUI — most
// commonly as a MongoDB Extended JSON shape like { "$oid": "..." }
// (that syntax is only meaningful to import/export tooling; MongoDB
// itself stores it as a literal object with a key named "$oid" if you
// paste it into a GUI's plain "Object" field type instead of selecting
// the ObjectId type). Rather than keep rejecting this, unwrap it.
function normalizeObjectId(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string" || value instanceof mongoose.Types.ObjectId) {
    return mongoose.isValidObjectId(value) ? String(value) : null;
  }

  if (typeof value === "object" && value !== null && "$oid" in (value as any)) {
    const inner = (value as any).$oid;
    return typeof inner === "string" && mongoose.isValidObjectId(inner) ? inner : null;
  }

  return null;
}

// Search used to only ever look at already-generated Trip documents, which
// meant nothing showed up for a date unless someone had separately hit
// the trip-generation cron for it (a job the admin has to remember to
// run). Instead of relying on that, search now self-heals: for the
// requested date, it checks every active TripSchedule that actually runs
// on that weekday and creates the matching Trip on the fly if it doesn't
// exist yet.
//
// This also has to tolerate hand-edited / malformed data in Mongo — one
// bad schedule document must never take down search for everyone else, so
// every schedule is processed inside its own try/catch, and routeId /
// vehicleId are normalized (see normalizeObjectId above) before use.
async function ensureTripsExistForDate(targetDate: Date) {
  const weekday = targetDate.getDay(); // 0-6

  const schedules = await TripSchedule.find({
    isActive: true,
    daysOfWeek: weekday,
  }).lean();

  for (const schedule of schedules) {
    try {
      if (schedule.validFrom && targetDate < startOfDay(schedule.validFrom)) continue;
      if (schedule.validTill && targetDate > startOfDay(schedule.validTill)) continue;

      const routeId = normalizeObjectId(schedule.routeId);
      const vehicleId = normalizeObjectId(schedule.vehicleId);
      const adminId = normalizeObjectId(schedule.adminId) ?? schedule.adminId;

      if (!routeId || !vehicleId) {
        console.warn(
          `Skipping TripSchedule ${schedule._id}: routeId/vehicleId could not be resolved to a valid ObjectId. ` +
          `Raw values — routeId: ${JSON.stringify(schedule.routeId)}, vehicleId: ${JSON.stringify(schedule.vehicleId)}`
        );
        continue;
      }

      const route = await Route.findById(routeId);
      const vehicle = await Vehicle.findById(vehicleId);
      if (!route || !vehicle) {
        console.warn(`Skipping TripSchedule ${schedule._id}: route or vehicle document not found for id ${routeId} / ${vehicleId}`);
        continue;
      }

      const stops = route.locations;
      const departureDateTime = combineDateAndTime(targetDate, schedule.departureTime);
      const duration = schedule.estimatedDurationInMinutes || route.estimatedDurationInMinutes || 0;
      const arrivalDateTime = new Date(departureDateTime.getTime() + duration * 60_000);

      // Upsert instead of find-then-create so two simultaneous searches
      // for the same date can't race and create duplicate trips.
      await Trip.findOneAndUpdate(
        { scheduleId: schedule._id, scheduledDate: targetDate },
        {
          $setOnInsert: {
            scheduleId: schedule._id,
            routeId,
            vehicleId,
            adminId,
            stops,
            scheduledDate: targetDate,
            departureDateTime,
            arrivalDateTime,
            seatingCapacity: vehicle.seatingCapacity,
            segmentOccupancy: new Array(Math.max(stops.length - 1, 0)).fill(0),
            status: "scheduled",
          },
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn(`Skipping TripSchedule ${schedule._id} due to an error:`, err);
      // Keep going — one bad schedule must not break search for everyone.
    }
  }
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

    // Auto-create any recurring trips scheduled to run on this date/weekday
    // that don't exist yet — see ensureTripsExistForDate() above.
    await ensureTripsExistForDate(targetDate);

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