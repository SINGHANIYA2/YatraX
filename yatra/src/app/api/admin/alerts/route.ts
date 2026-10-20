// app/api/admin/alerts/route.ts
//
// Alerts are computed live from real data — there's no persisted Alert
// model (and no GPS/fuel telematics feed to draw from), so this surfaces
// the operational issues that ARE derivable from what's actually stored:
//   - Vehicles assigned to a partner but currently offline
//   - Partner applications that have sat pending too long
//   - Bookings whose payment failed

import { auth } from "../../../../../src/auth";
import connectDb from "../../../../../src/lib/db";
import Admin from "../../../../../src/models/admin.models";
import Vehicle from "../../../../../src/models/vehicle.models";
import PartnerApplication from "../../../../../src/models/partnerApplication.models";
import Booking from "../../../../../src/models/booking.models";
import Trip from "../../../../../src/models/Trip.models";
import { NextResponse } from "next/server";

type Severity = "Critical" | "Warning" | "Resolved";

interface AlertItem {
  id: string;
  vehicle: string;
  type: string;
  severity: Severity;
  message: string;
  time: string;
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export async function GET() {
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

    const alerts: AlertItem[] = [];

    // 1. Vehicles assigned but currently offline
    const offlineVehicles = await Vehicle.find({
      adminId: admin._id,
      status: "assigned",
      isOnline: false,
    }).select("vehicleNumber updatedAt");

    for (const v of offlineVehicles) {
      alerts.push({
        id: `VEH-${v._id.toString().slice(-6).toUpperCase()}`,
        vehicle: v.vehicleNumber ?? "—",
        type: "Vehicle",
        severity: "Warning",
        message: "Vehicle is currently offline",
        time: timeAgo(v.updatedAt),
      });
    }

    // 2. Partner applications pending review (>48h = Critical, else Warning)
    const pendingApplications = await PartnerApplication.find({
      adminId: admin._id,
      status: { $in: ["pending", "under_review"] },
    }).select("name createdAt");

    for (const app of pendingApplications) {
      const hoursPending = (Date.now() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60);
      alerts.push({
        id: `APP-${app._id.toString().slice(-6).toUpperCase()}`,
        vehicle: "—",
        type: "Application",
        severity: hoursPending > 48 ? "Critical" : "Warning",
        message: `${app.name}'s partner application is awaiting review`,
        time: timeAgo(app.createdAt),
      });
    }

    // 3. Bookings on this admin's trips with a failed payment (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const adminVehicleIds = await Vehicle.find({ adminId: admin._id }).distinct("_id");
    const adminTripIds = await Trip.find({ vehicleId: { $in: adminVehicleIds } }).distinct("_id");

    const failedPayments = await Booking.find({
      tripId: { $in: adminTripIds },
      paymentStatus: "failed",
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate({ path: "tripId", select: "vehicleId", populate: { path: "vehicleId", select: "vehicleNumber" } })
      .select("totalFare createdAt tripId");

    for (const b of failedPayments as any[]) {
      alerts.push({
        id: `PAY-${b._id.toString().slice(-6).toUpperCase()}`,
        vehicle: b.tripId?.vehicleId?.vehicleNumber ?? "—",
        type: "Payment",
        severity: "Critical",
        message: `Payment of ₹${b.totalFare} failed`,
        time: timeAgo(b.createdAt),
      });
    }

    // 4. Recently resolved — applications approved in the last 24h (a real,
    // positive signal rather than a fabricated "resolved" count)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentlyApproved = await PartnerApplication.find({
      adminId: admin._id,
      status: "approved",
      updatedAt: { $gte: oneDayAgo },
    }).select("name updatedAt");

    for (const app of recentlyApproved) {
      alerts.push({
        id: `RES-${app._id.toString().slice(-6).toUpperCase()}`,
        vehicle: "—",
        type: "Application",
        severity: "Resolved",
        message: `${app.name}'s partner application was approved`,
        time: timeAgo(app.updatedAt),
      });
    }

    alerts.sort((a, b) => (a.severity === "Critical" ? -1 : 1));

    const stats = {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === "Critical").length,
      warning: alerts.filter((a) => a.severity === "Warning").length,
      resolved: alerts.filter((a) => a.severity === "Resolved").length,
    };

    return NextResponse.json({ success: true, alerts, stats }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to load alerts" }, { status: 500 });
  }
}
