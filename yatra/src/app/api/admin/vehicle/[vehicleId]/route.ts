import mongoose from "mongoose";
import connectDb from "@/lib/db";
import { auth } from "@/auth";

import Admin from "@/models/admin.models";
import Booking from "@/models/booking.models";

import { NextRequest, NextResponse } from "next/server";
import Vehicle from "@/models/vehicle.models";
import Location from "@/models/location.models";

console.log(Location);

export async function DELETE(
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

        // const admin = await Admin.findOne({
        //     email: authSession.user.email,
        // });

        const admin = await Admin.findById('6a3e89c071940960de5b6a2c');

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

            if (
                vehicle.status !== "available" ||
                vehicle.assignedPartnerId ||
                vehicle.routeId
            ) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Assigned or active vehicles cannot be deleted.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const activeBooking = await Booking.findOne({
                vehicleId: vehicle._id,
                rideStatus: {
                    $in: [
                        "pending",
                        "accepted",
                        "started",
                    ],
                },
            }).session(dbSession);

            if (activeBooking) {
                await dbSession.abortTransaction();

                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Vehicle has active bookings.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            await Vehicle.findByIdAndDelete(
                vehicle._id,
                {
                    session: dbSession,
                }
            );

            await Admin.findByIdAndUpdate(
                admin._id,
                {
                    $inc: {
                        totalVehicles: -1,
                    },
                },
                {
                    session: dbSession,
                }
            );

            await dbSession.commitTransaction();

            return NextResponse.json(
                {
                    success: true,
                    message:
                        "Vehicle deleted successfully.",
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

        const {
            vehicleType,
            brand,
            model,
            vehicleNumber,
            availableSeats,
            scheduledStartAt,
            scheduledEndAt,
            documents,
        } = await req.json();

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
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

        // Vehicle number must be unique
        if (
            vehicleNumber &&
            vehicleNumber !== vehicle.vehicleNumber
        ) {
            const exists = await Vehicle.findOne({
                vehicleNumber,
                _id: { $ne: vehicle._id },
            });

            if (exists) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Vehicle number already exists.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            vehicle.vehicleNumber =
                vehicleNumber.toUpperCase().trim();
        }

        if (vehicleType)
            vehicle.vehicleType = vehicleType;

        if (brand !== undefined)
            vehicle.brand = brand;

        if (model !== undefined)
            vehicle.model = model;

        if (availableSeats !== undefined)
            vehicle.availableSeats = availableSeats;

        if (scheduledStartAt)
            vehicle.scheduledStartAt =
                new Date(scheduledStartAt);

        if (scheduledEndAt)
            vehicle.scheduledEndAt =
                new Date(scheduledEndAt);

        if (documents) {
            vehicle.documents = {
                ...vehicle.documents,
                ...documents,
            };
        }

        await vehicle.save();

        await vehicle.populate([
            {
                path: "assignedPartnerId",
                select: `
                    name
                    phone
                    averageRating
                `,
            },
            {
                path: "routeId",
                select: `
                    distanceInKm
                    estimatedDurationInMinutes
                    locations
                `,
                populate: {
                    path: "locations",
                    select: `
                        name
                        city
                    `,
                },
            },
        ]);

        return NextResponse.json(
            {
                success: true,
                message:
                    "Vehicle updated successfully.",
                vehicle,
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
                message:
                    "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(
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

        // const admin = await Admin.findOne({
        //     email: authSession.user.email,
        // });
        const admin = await Admin.findById('6a3e89c071940960de5b6a2c');

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

        console.log("Params:", params);

        const { vehicleId } = await params;

        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            adminId: admin._id,
        })
            .populate({
                path: "assignedPartnerId",
                select: `
                    name
                    phone
                    averageRating
                    totalRides
                    completedRides
                    cancelledRides
                    profilePhoto
                    currentLatitude
                    currentLongitude
                    isOnline
                    isAvailable
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
            })
            .lean();

        if (!vehicle) {
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

        return NextResponse.json(
            {
                success: true,

                vehicle,

                assignment: {
                    isAssigned: !!vehicle.assignedPartnerId,
                    assignedAt: vehicle.assignedAt,
                    partner: vehicle.assignedPartnerId,
                },

                trip: {
                    status: vehicle.tripStatus,
                    scheduledStartAt:
                        vehicle.scheduledStartAt,
                    scheduledEndAt:
                        vehicle.scheduledEndAt,
                },

                tracking: {
                    isOnline: vehicle.isOnline,
                    latitude:
                        vehicle.currentLatitude,
                    longitude:
                        vehicle.currentLongitude,
                    speed: vehicle.speed,
                    heading: vehicle.heading,
                    lastLocationUpdate:
                        vehicle.lastLocationUpdate,
                },

                capacity: {
                    availableSeats:
                        vehicle.availableSeats,
                },

                routeSummary: vehicle.routeId
                    ? {
                          totalStops:
                              vehicle.routeId.locations
                                  ?.length ?? 0,
                          distance:
                              vehicle.routeId
                                  .distanceInKm,
                          estimatedDuration:
                              vehicle.routeId
                                  .estimatedDurationInMinutes,
                      }
                    : null,

                documents: vehicle.documents,
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
                message: "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}