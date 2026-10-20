import mongoose from "mongoose";
import connectDb from "../../../../../../src/lib/db";
import { auth } from "../../../../../../src/auth";

import Admin from "../../../../../../src/models/admin.models";
import Booking from "../../../../../../src/models/booking.models";

import { NextRequest, NextResponse } from "next/server";
import Vehicle from "../../../../../../src/models/vehicle.models";
import Location from "../../../../../../src/models/location.models";

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
                    estimatedFare
                    farePerKm
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

        const vehicleData = vehicle as any;

        return NextResponse.json(
            {
                success: true,

                vehicle: vehicleData,

                // assignment: {
                //     isAssigned: !!vehicleData.assignedPartnerId,
                //     assignedAt: vehicleData.assignedAt,
                //     partner: vehicleData.assignedPartnerId,
                // },

                assignment: {
                    isAssigned: !!vehicleData.assignedPartnerId,
                    assignedAt: vehicleData.assignedAt,
                    partner: vehicleData.assignedPartnerId,
                },
                trip: {
                    status: vehicleData.tripStatus,
                    scheduledStartAt:
                        vehicleData.scheduledStartAt,
                    scheduledEndAt:
                        vehicleData.scheduledEndAt,
                },

                tracking: {
                    isOnline: vehicleData.isOnline,
                    latitude:
                        vehicleData.currentLatitude,
                    longitude:
                        vehicleData.currentLongitude,
                    speed: vehicleData.speed,
                    heading: vehicleData.heading,
                    lastLocationUpdate:
                        vehicleData.lastLocationUpdate,
                },

                capacity: {
                    availableSeats:
                        vehicleData.availableSeats,
                },

                routeSummary: vehicleData.routeId
                    ? {
                          totalStops:
                              vehicleData.routeId.locations
                                  ?.length ?? 0,
                          distance:
                              vehicleData.routeId
                                  .distanceInKm,
                          estimatedDuration:
                              vehicleData.routeId
                                  .estimatedDurationInMinutes,
                      }
                    : null,

                documents: vehicleData.documents,
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