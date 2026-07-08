// app/api/booking/history/route.ts
//
// GET /api/booking/history — one endpoint, three different views depending
// on who's asking:
//   - role "user"    -> their own bookings
//   - role "partner" -> bookings made on trips run by their assigned vehicle
//   - role "admin"   -> all bookings (optionally filter by ?partnerId= or ?userId=)

import connectDb from "@/lib/db";
import Booking from "@/models/booking.models";
import Trip from "@/models/Trip.models";
import Partner from "@/models/partner.models";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        let bookings;

        if (session.user.role === "user") {
            bookings = await Booking.find({ userId: session.user.id })
                .populate({ path: "boardStopId", select: "name city" })
                .populate({ path: "alightStopId", select: "name city" })
                .sort({ createdAt: -1 });
        }
        else if (session.user.role === "partner") {
            const partner = await Partner.findOne({ userId: session.user.id });

            if (!partner || !partner.assignedVehicleId) {
                return NextResponse.json({ success: true, bookings: [] }, { status: 200 });
            }

            // Bookings live on trips, trips belong to a vehicle — find this
            // partner's vehicle's trips, then bookings on those trips.
            const tripIds = await Trip.find({ vehicleId: partner.assignedVehicleId }).distinct("_id");

            bookings = await Booking.find({ tripId: { $in: tripIds } })
                .populate({ path: "boardStopId", select: "name city" })
                .populate({ path: "alightStopId", select: "name city" })
                .populate({ path: "tripId", select: "departureDateTime status" })
                .sort({ createdAt: -1 });
        } else if (session.user.role === "admin") {
            bookings = await Booking.find({})
                .populate({ path: "boardStopId", select: "name city" })
                .populate({ path: "alightStopId", select: "name city" })
                .populate({ path: "tripId", select: "departureDateTime status vehicleId" })
                .sort({ createdAt: -1 })
                .limit(200); // admin view — paginate properly later if this grows
        } else {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const result = bookings.map((b: any) => ({
            id: b._id,
            tripId: b.tripId?._id ?? b.tripId,
            boardStopName: b.boardStopId?.name,
            alightStopName: b.alightStopId?.name,
            passengers: b.passengers,
            seatsBooked: b.seatsBooked,
            distanceKm: b.distanceKm,
            farePerPassenger: b.farePerPassenger,
            totalFare: b.totalFare,
            paymentMethod: b.paymentMethod,
            paymentStatus: b.paymentStatus,
            bookingStatus: b.bookingStatus,
            departureDateTime: b.tripId?.departureDateTime,
            createdAt: b.createdAt,
        }));

        return NextResponse.json({ success: true, bookings: result }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch booking history" },
            { status: 500 }
        );
    }
}