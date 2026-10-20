import { auth } from "../../../../../src/auth";
import connectDb from "../../../../../src/lib/db";
import Admin from "../../../../../src/models/admin.models";
import TripSchedule from "../../../../../src/models/Tripschedule.models";
import Route from "../../../../../src/models/Route.models";
import Vehicle from "../../../../../src/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

const DAY_RANGE = [0, 1, 2, 3, 4, 5, 6];

export async function GET(req: NextRequest) {
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

    const schedules = await TripSchedule.find({ adminId: admin._id })
      .populate({
        path: "routeId",
        select: "locations distanceInKm",
        populate: { path: "locations", select: "name city" },
      })
      .populate({ path: "vehicleId", select: "vehicleNumber brand model vehicleType" })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, schedules }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const {
      routeId,
      vehicleId,
      departureTime,
      estimatedDurationInMinutes,
      daysOfWeek,
      validFrom,
      validTill,
    } = await req.json();

    if (!routeId || !vehicleId || !departureTime) {
      return NextResponse.json(
        { success: false, message: "routeId, vehicleId and departureTime are required" },
        { status: 400 }
      );
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(departureTime)) {
      return NextResponse.json(
        { success: false, message: "departureTime must be in HH:mm 24hr format" },
        { status: 400 }
      );
    }

    const days = Array.isArray(daysOfWeek) && daysOfWeek.length > 0 ? daysOfWeek : DAY_RANGE;
    if (!days.every((d: number) => DAY_RANGE.includes(d))) {
      return NextResponse.json({ success: false, message: "Invalid daysOfWeek values" }, { status: 400 });
    }

    // Both must belong to this admin — prevents assigning another admin's
    // route/vehicle via a crafted request.
    const [route, vehicle] = await Promise.all([
      Route.findOne({ _id: routeId, adminId: admin._id }),
      Vehicle.findOne({ _id: vehicleId, adminId: admin._id }),
    ]);

    if (!route) {
      return NextResponse.json({ success: false, message: "Route not found" }, { status: 404 });
    }
    if (!vehicle) {
      return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    }

    const schedule = await TripSchedule.create({
      adminId: admin._id,
      routeId,
      vehicleId,
      departureTime,
      estimatedDurationInMinutes: estimatedDurationInMinutes || route.estimatedDurationInMinutes || 0,
      daysOfWeek: days,
      isActive: true,
      validFrom: validFrom || undefined,
      validTill: validTill || undefined,
    });

    return NextResponse.json(
      { success: true, message: "Schedule created", schedule },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to create schedule" }, { status: 500 });
  }
}
