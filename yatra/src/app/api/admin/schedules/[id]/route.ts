import { auth } from "../../../../../../src/auth";
import connectDb from "../../../../../../src/lib/db";
import Admin from "../../../../../../src/models/admin.models";
import TripSchedule from "../../../../../../src/models/Tripschedule.models";
import Trip from "../../../../../../src/models/Trip.models";
import { NextRequest, NextResponse } from "next/server";

const DAY_RANGE = [0, 1, 2, 3, 4, 5, 6];

function combineDateAndTime(date: Date, hhmm: string): Date {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const admin = await Admin.findOne({ email: session.user.email });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    const { id } = await params;
    const schedule = await TripSchedule.findOne({ _id: id, adminId: admin._id });

    if (!schedule) {
      return NextResponse.json({ success: false, message: "Schedule not found" }, { status: 404 });
    }

    const {
      departureTime,
      estimatedDurationInMinutes,
      daysOfWeek,
      isActive,
      validFrom,
      validTill,
      vehicleId,
    } = await req.json();

    if (departureTime !== undefined) {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(departureTime)) {
        return NextResponse.json(
          { success: false, message: "departureTime must be in HH:mm 24hr format" },
          { status: 400 }
        );
      }
      schedule.departureTime = departureTime;
    }

    if (estimatedDurationInMinutes !== undefined) {
      schedule.estimatedDurationInMinutes = estimatedDurationInMinutes;
    }

    if (daysOfWeek !== undefined) {
      if (!Array.isArray(daysOfWeek) || !daysOfWeek.every((d: number) => DAY_RANGE.includes(d))) {
        return NextResponse.json({ success: false, message: "Invalid daysOfWeek values" }, { status: 400 });
      }
      schedule.daysOfWeek = daysOfWeek;
    }

    if (isActive !== undefined) schedule.isActive = isActive;
    if (validFrom !== undefined) schedule.validFrom = validFrom || undefined;
    if (validTill !== undefined) schedule.validTill = validTill || undefined;
    if (vehicleId !== undefined) schedule.vehicleId = vehicleId;

    await schedule.save();

    // Ripple the new timing forward onto any already-generated trips for
    // this schedule that haven't departed yet, so "update the timing"
    // actually changes upcoming trips instead of only affecting trips
    // generated after this edit. Trips that already have bookings are
    // still updated — only the timing/vehicle change, not seat data.
    if (departureTime !== undefined || estimatedDurationInMinutes !== undefined || vehicleId !== undefined) {
      const upcomingTrips = await Trip.find({
        scheduleId: schedule._id,
        status: "scheduled",
        departureDateTime: { $gte: new Date() },
      });

      for (const trip of upcomingTrips) {
        const newDeparture = combineDateAndTime(trip.scheduledDate, schedule.departureTime);
        const newArrival = new Date(
          newDeparture.getTime() + (schedule.estimatedDurationInMinutes || 0) * 60_000
        );

        trip.departureDateTime = newDeparture;
        trip.arrivalDateTime = newArrival;
        if (vehicleId !== undefined) trip.vehicleId = vehicleId;

        await trip.save();
      }
    }

    return NextResponse.json({ success: true, message: "Schedule updated", schedule }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to update schedule" }, { status: 500 });
  }
}

// Soft delete only — sets isActive: false rather than removing the
// document, since generated Trip documents keep a scheduleId reference
// back to this record (used for display/audit, not required for the
// trip to keep working — Trip stores its own snapshot of everything).
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const admin = await Admin.findOne({ email: session.user.email });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    const { id } = await params;
    const schedule = await TripSchedule.findOneAndUpdate(
      { _id: id, adminId: admin._id },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!schedule) {
      return NextResponse.json({ success: false, message: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Schedule deactivated", schedule }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to deactivate schedule" }, { status: 500 });
  }
}
