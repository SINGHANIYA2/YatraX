
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "../../../../../src/auth";
import connectDb from "../../../../../src/lib/db";
import Booking from "../../../../../src/models/booking.models";
import Partner from "../../../../../src/models/partner.models";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.id || !session.user.role) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { bookingId } = await params;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json(
                { success: false, message: "Invalid booking ID" },
                { status: 400 }
            );
        }

        const booking: any = await Booking.findById(bookingId)
            .populate({
                path: "partnerId",
                select: `
                    name
                    phone
                    averageRating
                    profilePhoto
                    currentLatitude
                    currentLongitude
                    isOnline
                    userId
                `,
            })
            .populate({
                path: "vehicleId",
                select: `
                    vehicleNumber
                    vehicleType
                    brand
                    model
                    seatingCapacity
                    availableSeats
                `,
            })
            .populate({
                path: "source",
                select: "name city state latitude longitude",
            })
            .populate({
                path: "destination",
                select: "name city state latitude longitude",
            })
            .populate({
                path: "routeId",
                select: `
                    distanceInKm
                    estimatedDurationInMinutes
                    geometry
                    locations
                `,
                populate: {
                    path: "locations",
                    select: "name city latitude longitude",
                },
            })
            .lean();

        if (!booking) {
            return NextResponse.json(
                { success: false, message: "Booking not found" },
                { status: 404 }
            );
        }

        const userId = String(session.user.id);
        const role = session.user.role;

        // Booking owner
        const bookingUserId = String(
            booking.userId?._id ?? booking.userId ?? ""
        );

        const isOwner = bookingUserId === userId;

        // Admin access
        const isAdmin = role === "admin";

        // Partner access: assigned vehicle or partner attached to booking
        let isAssignedPartner = false;

        if (role === "partner") {
            const partner = await Partner.findOne({
                userId: userId,
            })
                .select("_id assignedVehicleId")
                .lean();

            const partnerRecord = Array.isArray(partner)
                ? partner[0]
                : partner;

            if (partnerRecord) {
                const bookingVehicleId = String(
                    booking.vehicleId?._id ??
                    booking.vehicleId ??
                    ""
                );

                const assignedVehicleId = String(
                    partnerRecord.assignedVehicleId ?? ""
                );

                const bookingPartnerId = String(
                    booking.partnerId?._id ??
                    booking.partnerId ??
                    ""
                );

                isAssignedPartner =
                    (!!assignedVehicleId &&
                        assignedVehicleId === bookingVehicleId) ||
                    bookingPartnerId === String(partnerRecord._id);
            }
        }

        if (!isOwner && !isAdmin && !isAssignedPartner) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not authorized to view this booking",
                },
                { status: 403 }
            );
        }

        const timeline: {
            status: string;
            time: Date | string;
        }[] = [
            {
                status: "Booked",
                time: booking.createdAt,
            },
        ];

        if (booking.acceptedAt) {
            timeline.push({
                status: "Accepted",
                time: booking.acceptedAt,
            });
        }

        if (booking.actualStartAt) {
            timeline.push({
                status: "Ride Started",
                time: booking.actualStartAt,
            });
        }

        if (booking.actualEndAt) {
            timeline.push({
                status: "Completed",
                time: booking.actualEndAt,
            });
        }

        if (booking.cancelledAt) {
            timeline.push({
                status: "Cancelled",
                time: booking.cancelledAt,
            });
        }

        timeline.sort(
            (a, b) =>
                new Date(a.time).getTime() -
                new Date(b.time).getTime()
        );

        const canCancel =
            booking.rideStatus === "pending" ||
            booking.rideStatus === "accepted";

        const canCallPartner =
            booking.rideStatus !== "completed" &&
            booking.rideStatus !== "cancelled";

        const canTrack =
            booking.rideStatus === "accepted" ||
            booking.rideStatus === "started";

        const partnerLocation =
            canTrack && booking.partnerId
                ? {
                    latitude: booking.partnerId.currentLatitude,
                    longitude: booking.partnerId.currentLongitude,
                    isOnline: booking.partnerId.isOnline,
                }
                : null;

        const rideDuration =
            booking.actualEndAt && booking.actualStartAt
                ? Math.floor(
                    (
                        new Date(booking.actualEndAt).getTime() -
                        new Date(booking.actualStartAt).getTime()
                    ) / 60000
                )
                : null;

        return NextResponse.json(
            {
                success: true,
                booking,
                timeline,
                canCancel,
                canCallPartner,
                canTrack,
                partnerLocation,

                rideSummary: {
                    status: booking.rideStatus,
                    seatsBooked: booking.seatsBooked,
                    scheduledStartAt: booking.scheduledStartAt,
                    scheduledEndAt: booking.scheduledEndAt,
                    actualStartAt: booking.actualStartAt,
                    actualEndAt: booking.actualEndAt,
                },

                routeSummary: {
                    totalStops: booking.routeId?.locations?.length ?? 0,
                    distance: booking.routeId?.distanceInKm ?? 0,
                    estimatedDuration:
                        booking.routeId?.estimatedDurationInMinutes ?? 0,
                },

                rideDuration,

                fareSummary: {
                    baseFare: booking.fare,
                    tax: 0,
                    discount: 0,
                    total: booking.fare,
                    paymentStatus: booking.paymentStatus,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/bookings/[bookingId] error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
