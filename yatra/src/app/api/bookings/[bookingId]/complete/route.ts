import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Booking from "@/models/booking.models";
import Partner from "@/models/partner.models";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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
                {
                    status: 401,
                }
            );
        }

        const partner = await Partner.findOne({
            email: authSession.user.email,
        });

        if (!partner) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Partner not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const dbSession = await mongoose.startSession();

        try {
            dbSession.startTransaction();

            const { bookingId } = await params;

            const booking = await Booking.findById(
                bookingId
            ).session(dbSession);

            if (!booking) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Booking not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            if (
                booking.partnerId.toString() !==
                partner._id.toString()
            ) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Unauthorized.",
                    },
                    {
                        status: 403,
                    }
                );
            }

            if (booking.rideStatus !== "started") {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Ride has not started.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const vehicle = await Vehicle.findById(
                booking.vehicleId
            ).session(dbSession);

            if (!vehicle) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Vehicle not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            const admin = await Admin.findById(
                vehicle.adminId
            ).session(dbSession);

            if (!admin) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Admin not found.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            booking.rideStatus = "completed";
            booking.paymentStatus = "paid";
            booking.actualEndAt = new Date();

            await booking.save({
                session: dbSession,
            });

            vehicle.availableSeats += booking.seatsBooked;

            await vehicle.save({
                session: dbSession,
            });

            partner.totalRides += 1;
            partner.completedRides += 1;

            partner.totalEarned += booking.fare;
            partner.todayEarnings += booking.fare;
            partner.walletBalance += booking.fare;

            partner.lastRideAt = new Date();

            await partner.save({
                session: dbSession,
            });

            admin.totalRevenue += booking.fare;

            await admin.save({
                session: dbSession,
            });

            await dbSession.commitTransaction();

            await booking.populate([
                {
                    path: "userId",
                    select: "name phone"
                },
                {
                    path: "partnerId",
                    select: "name phone averageRating"
                },
                {
                    path: "vehicleId",
                    select: "vehicleNumber brand model"
                },
                {
                    path: "source",
                    select: "name city"
                },
                {
                    path: "destination",
                    select: "name city"
                }
            ]);

            return NextResponse.json(
                {
                    success: true,
                    message: "Ride completed successfully.",
                    booking,
                },
                {
                    status: 200,
                }
            );
        } catch (error) {
            await dbSession.abortTransaction();
            throw error;
        } finally {
            dbSession.endSession();
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}