// app/api/cron/generate-trips/route.ts
//
// Trigger this once a day (e.g. via Vercel Cron, or any external scheduler
// hitting this URL with the right header). It looks at every active
// TripSchedule, checks whether it should run on the target date (respecting
// daysOfWeek + validFrom/validTill), and creates a Trip for it if one
// doesn't already exist.
//
// Vercel Cron example (vercel.json):
// {
//   "crons": [{ "path": "/api/cron/generate-trips", "schedule": "0 0 * * *" }]
// }

import connectDb from "@/lib/db";
import TripSchedule from "@/models/Tripschedule.models";
import Trip from "@/models/Trip.models";
import Route from "@/models/route.models";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

// How many days ahead to generate trips for a single run.
// Generating a few days ahead (not just "tomorrow") gives you a buffer
// in case the cron job fails to run on a given day.
const DAYS_AHEAD = 3;

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

export async function GET(req: NextRequest) {
  try {
    // Protect this route — anyone who can hit it can spam-generate trips.
    const cronSecret = req.nextUrl.searchParams.get("secret");
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const schedules = await TripSchedule.find({ isActive: true });

    const results: { scheduleId: string; date: string; status: string }[] = [];

    for (const schedule of schedules) {
      for (let offset = 0; offset < DAYS_AHEAD; offset++) {
        const targetDate = startOfDay(new Date());
        targetDate.setDate(targetDate.getDate() + offset);

        const weekday = targetDate.getDay(); // 0-6

        // Skip if this schedule doesn't run on this weekday
        if (!schedule.daysOfWeek.includes(weekday)) continue;

        // Skip if outside the schedule's valid window
        if (schedule.validFrom && targetDate < startOfDay(schedule.validFrom)) continue;
        if (schedule.validTill && targetDate > startOfDay(schedule.validTill)) continue;

        // Skip if a trip already exists for this schedule + date
        const alreadyExists = await Trip.findOne({
          scheduleId: schedule._id,
          scheduledDate: targetDate,
        });

        if (alreadyExists) {
          results.push({
            scheduleId: schedule._id.toString(),
            date: targetDate.toISOString().slice(0, 10),
            status: "already exists",
          });
          continue;
        }

        // Snapshot route stops + vehicle capacity at generation time
        const route = await Route.findById(schedule.routeId);
        const vehicle = await Vehicle.findById(schedule.vehicleId);

        if (!route || !vehicle) {
          results.push({
            scheduleId: schedule._id.toString(),
            date: targetDate.toISOString().slice(0, 10),
            status: "skipped — route or vehicle missing",
          });
          continue;
        }

        const stops = route.locations; // ordered Location ids
        const departureDateTime = combineDateAndTime(targetDate, schedule.departureTime);
        const duration = schedule.estimatedDurationInMinutes || route.estimatedDurationInMinutes || 0;
        const arrivalDateTime = new Date(departureDateTime.getTime() + duration * 60_000);

        await Trip.create({
          scheduleId: schedule._id,
          routeId: schedule.routeId,
          vehicleId: schedule.vehicleId,
          adminId: schedule.adminId,
          stops,
          scheduledDate: targetDate,
          departureDateTime,
          arrivalDateTime,
          seatingCapacity: vehicle.seatingCapacity,
          // One zeroed counter per segment (gap between consecutive stops)
          segmentOccupancy: new Array(Math.max(stops.length - 1, 0)).fill(0),
          status: "scheduled",
        });

        results.push({
          scheduleId: schedule._id.toString(),
          date: targetDate.toISOString().slice(0, 10),
          status: "created",
        });
      }
    }

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to generate trips" },
      { status: 500 }
    );
  }
}