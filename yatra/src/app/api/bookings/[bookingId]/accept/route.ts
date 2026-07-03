import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.models";
import Partner from "@/models/partner.models";
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

            if (booking.rideStatus !== "pending") {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Booking already accepted.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            booking.rideStatus = "accepted";
            booking.acceptedAt = new Date();

            await booking.save({
                session: dbSession,
            });

            await dbSession.commitTransaction();

            return NextResponse.json(
                {
                    success: true,
                    message: "Booking accepted successfully.",
                    booking,
                },
                {
                    status: 200,
                }
            );
        } catch (err) {
            await dbSession.abortTransaction();
            throw err;
        } finally {
            dbSession.endSession();
        }
    } catch (err) {
        console.log(err);

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