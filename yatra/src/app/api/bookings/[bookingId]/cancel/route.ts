import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
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

        const user = await User.findOne({
            email: authSession.user.email,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                {
                    status: 404,
                }
            );
        }


        // Start transaction only after validations
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

            // Check booking ownership
            if (
                booking.userId.toString() !==
                user._id.toString()
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

            if (
                !["pending", "accepted"].includes(
                    booking.rideStatus
                )
            ) {
                await dbSession.abortTransaction();
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Booking cannot be cancelled.",
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



            vehicle.availableSeats += booking.seatsBooked;

            await vehicle.save({ session: dbSession, });

            booking.rideStatus = "cancelled";
            booking.cancelledAt = new Date();

            await booking.save({
                session: dbSession,
            });

            await dbSession.commitTransaction();

            await booking.populate([
                {
                    path: "vehicleId",
                    select: "vehicleNumber brand model",
                },
                {
                    path: "source",
                    select: "name city",
                },
                {
                    path: "destination",
                    select: "name city",
                },
            ]);

            return NextResponse.json(
                {
                    success: true,
                    message:
                        "Booking cancelled successfully.",
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