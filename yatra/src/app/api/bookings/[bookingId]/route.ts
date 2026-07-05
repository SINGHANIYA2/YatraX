import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        await connectDb();

        const authSession = await auth();

        if (!authSession?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const user = await User.findOne({
            email: authSession.user.email,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const { bookingId } = await params;

        const booking = await Booking.findById(bookingId)
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
                select: `
                    name
                    city
                    state
                    latitude
                    longitude
                `,
            })
            .populate({
                path: "destination",
                select: `
                    name
                    city
                    state
                    latitude
                    longitude
                `,
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
                    select: `
                        name
                        city
                        latitude
                        longitude
                    `,
                },
            }).lean();

        if (!booking) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Booking not found",
                },
                { status: 404 }
            );
        }

        if (booking.userId._id.toString() !== user._id.toString()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 403 }
            );
        }

        const timeline = [
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
            booking.actualEndAt &&
                booking.actualStartAt
                ? Math.floor(
                    (booking.actualEndAt.getTime() -
                        booking.actualStartAt.getTime()) /
                    60000
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
                    paymentStatus: booking.paymentStatus
                }
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}