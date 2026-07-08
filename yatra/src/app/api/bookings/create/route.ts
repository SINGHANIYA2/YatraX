// app/api/booking/create/route.ts

import connectDb from "@/lib/db";
import Trip from "@/models/Trip.models";
import Booking from "@/models/booking.models";
import { auth } from "@/auth";
import { haversineKm, calcFarePerPassenger } from "@/lib/fare";
import { NextRequest, NextResponse } from "next/server";

interface PassengerInput {
    name: string;
    age: number;
    gender: "male" | "female" | "other";
}

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const {
            tripId,
            boardStopId,
            alightStopId,
            passengers,
            paymentMethod,
        }: {
            tripId: string;
            boardStopId: string;
            alightStopId: string;
            passengers: PassengerInput[];
            paymentMethod: "upi" | "card" | "wallet" | "netbanking";
        } = await req.json();

        if (!tripId || !boardStopId || !alightStopId || !passengers?.length || !paymentMethod) {
            return NextResponse.json(
                { success: false, message: "Missing required booking details" },
                { status: 400 }
            );
        }

        const trip = await Trip.findById(tripId).populate({
            path: "stops",
            select: "name city latitude longitude",
        }).populate({ path: "vehicleId", select: "vehicleType" });

        if (!trip || trip.status !== "scheduled") {
            return NextResponse.json(
                { success: false, message: "Trip not found or no longer available" },
                { status: 404 }
            );
        }

        // Recompute board/alight indices server-side from the trip's own stop
        // list — never trust client-supplied indices, since a tampered index
        // could point at the wrong segment and dodge the availability check.
        const stopIds = trip.stops.map((s: any) => s._id.toString());
        const boardIndex = stopIds.indexOf(boardStopId);
        const alightIndex = stopIds.indexOf(alightStopId);

        if (boardIndex === -1 || alightIndex === -1 || boardIndex >= alightIndex) {
            return NextResponse.json(
                { success: false, message: "Invalid board/alight stops for this trip" },
                { status: 400 }
            );
        }

        const seatsRequested = passengers.length;
        const segmentIndices = Array.from(
            { length: alightIndex - boardIndex },
            (_, i) => boardIndex + i
        );

        // --- Atomic reserve ---
        // Single conditional update: only succeeds if EVERY segment this
        // booking touches still has room. If two requests race for the last
        // seat on the same segment, only one of these updateOne calls will
        // match (and therefore increment) — the loser gets matchedCount 0 and
        // is told to retry, instead of both silently succeeding and overbooking.
        const filter: Record<string, any> = { _id: trip._id, status: "scheduled" };
        const inc: Record<string, number> = {};

        for (const i of segmentIndices) {
            filter[`segmentOccupancy.${i}`] = { $lte: trip.seatingCapacity - seatsRequested };
            inc[`segmentOccupancy.${i}`] = seatsRequested;
        }

        const reserveResult = await Trip.updateOne(filter, { $inc: inc });

        if (reserveResult.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Seats just got taken on this segment — please search again" },
                { status: 409 }
            );
        }

        // --- Compute fare server-side (never trust a client-supplied fare) ---
        const boardStop = trip.stops[boardIndex];
        const alightStop = trip.stops[alightIndex];

        const distanceKm =
            Math.round(
                haversineKm(
                    [boardStop.latitude, boardStop.longitude],
                    [alightStop.latitude, alightStop.longitude]
                ) * 10
            ) / 10;

        const vehicleType = (trip.vehicleId as any).vehicleType;
        const farePerPassenger = calcFarePerPassenger(vehicleType, distanceKm);
        const totalFare = farePerPassenger * seatsRequested;

        let booking;
        try {
            booking = await Booking.create({
                tripId: trip._id,
                userId: session.user.id,
                boardStopId,
                alightStopId,
                boardIndex,
                alightIndex,
                passengers,
                seatsBooked: seatsRequested,
                distanceKm,
                farePerPassenger,
                totalFare,
                paymentMethod,
                paymentStatus: "pending",
                bookingStatus: "confirmed",
            });
        } catch (bookingCreateError) {
            // The seat reservation on Trip already succeeded above — if creating
            // the Booking record itself fails, we must release those seats back,
            // otherwise they're stuck reserved forever with no booking to show for it.
            const releaseInc: Record<string, number> = {};
            for (const i of segmentIndices) releaseInc[`segmentOccupancy.${i}`] = -seatsRequested;
            await Trip.updateOne({ _id: trip._id }, { $inc: releaseInc });

            throw bookingCreateError;
        }

        return NextResponse.json(
            {
                success: true,
                booking: {
                    id: booking._id,
                    tripId: trip._id,
                    boardStopName: boardStop.name,
                    alightStopName: alightStop.name,
                    distanceKm,
                    farePerPassenger,
                    totalFare,
                    seatsBooked: seatsRequested,
                    paymentStatus: booking.paymentStatus,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Failed to create booking" },
            { status: 500 }
        );
    }
}