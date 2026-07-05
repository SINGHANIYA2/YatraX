import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDb from "@/lib/db";

import Booking from "@/models/booking.models";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import Vehicle from "@/models/vehicle.models";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ vehicleId: string }> }
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

        const admin = await Admin.findOne({
            email: authSession.user.email,
        });

        if (!admin) {
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

        const { vehicleId } = await params;

        const dbSession = await mongoose.startSession();

        try {
            dbSession.startTransaction();

            const vehicle = await Vehicle.findById(vehicleId)
                .session(dbSession);

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

            if (
                vehicle.adminId.toString() !==
                admin._id.toString()
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

            if (!vehicle.assignedPartnerId) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Vehicle is not assigned.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (vehicle.tripStatus !== "idle") {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Vehicle is currently on a trip.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const activeBooking = await Booking.findOne({
                vehicleId: vehicle._id,
                rideStatus: {
                    $in: ["pending", "accepted", "started"],
                },
            }).session(dbSession);

            if (activeBooking) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message: "Vehicle has active bookings.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const partner = await Partner.findById(
                vehicle.assignedPartnerId
            ).session(dbSession);

            if (!partner) {
                await dbSession.abortTransaction();

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

            partner.assignedVehicleId = null;
            partner.isAvailable = true;

            await partner.save({
                session: dbSession,
            });

            vehicle.assignedPartnerId = null;
            vehicle.routeId = null;
            vehicle.status = "available";
            vehicle.tripStatus = "idle";
            vehicle.assignedAt = null;
            vehicle.scheduledStartAt = null;
            vehicle.scheduledEndAt = null;

            await vehicle.save({
                session: dbSession,
            });

            admin.activeVehicles -= 1;

            await admin.save({
                session: dbSession,
            });

            await dbSession.commitTransaction();

            return NextResponse.json(
                {
                    success: true,
                    message:
                        "Vehicle unassigned successfully.",
                    vehicleId: vehicle._id,
                    partnerId: partner._id,
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