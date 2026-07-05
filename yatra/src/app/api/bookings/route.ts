import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.models";
import User from "@/models/user.models";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
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
            email: session.user.email,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        const {
            vehicleId,
            source,
            destination,
            seatsBooked,
        } = await req.json();

        if (
            !vehicleId ||
            !source ||
            !destination ||
            !seatsBooked
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle, source, destination and seatsBooked are required."
                },
                {
                    status: 400,
                }
            );
        };

        if (
            seatsBooked !== undefined &&
            (!Number.isInteger(seatsBooked) || seatsBooked <= 0)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid number of seats.",
                },
                {
                    status: 400,
                }
            );
        }

        const vehicle = await Vehicle.findById(vehicleId).populate(
            "routeId"
        );

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

        const now = new Date();

        if (vehicle.scheduledStartTime <= now) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Booking is closed for this vehicle.",
                },
                {
                    status: 400,
                }
            );
        }


        if (
            vehicle.status !== "assigned" ||
            !vehicle.routeId ||
            !vehicle.assignedPartnerId
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle is not available for booking.",
                },
                {
                    status: 400,
                }
            );
        }

        const route = vehicle.routeId as any;

        const routeLocations = route.locations.map((id: any) =>
            id.toString()
        );

        const sourceIndex = routeLocations.indexOf(source);
        const destinationIndex = routeLocations.indexOf(destination);

        if (
            sourceIndex === -1 ||
            destinationIndex === -1 ||
            sourceIndex >= destinationIndex
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid source or destination.",
                },
                {
                    status: 400,
                }
            );
        }

        const existingBooking = await Booking.findOne({
            userId: user._id,
            vehicleId: vehicle._id,
            rideStatus: {
                $in: [
                    "pending",
                    "accepted",
                    "started",
                ],
            },
        });

        if (existingBooking) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You already have an active booking.",
                },
                {
                    status: 400,
                }
            );
        }

        if (vehicle.availableSeats < seatsBooked) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not enough seats available.",
                },
                {
                    status: 400,
                }
            );
        }

        vehicle.availableSeats -= seatsBooked;
        await vehicle.save();

        const booking = await Booking.create({
            userId: user._id,

            partnerId: vehicle.assignedPartnerId,

            vehicleId: vehicle._id,

            routeId: vehicle.routeId,

            source,

            destination,

            seatsBooked: seatsBooked ?? 1,

            scheduledStartAt: vehicle.scheduledStartTime,

            scheduledEndAt: vehicle.scheduledEndTime,

            fare: 0,

            paymentStatus: "pending",

            rideStatus: "pending",
        });

        await booking.populate([
            {
                path: "vehicleId",
                select: "vehicleNumber brand model",
            },
            {
                path: "partnerId",
                select: "name phone",
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
                message: "Booking created successfully.",
                booking,
            },
            {
                status: 201,
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

export async function GET() {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
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
            email: session.user.email,
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

        const bookings = await Booking.find({
            userId: user._id,
        })
            .populate({
                path: "vehicleId",
                select:
                    "vehicleNumber vehicleType brand model",
            })
            .populate({
                path: "partnerId",
                select:
                    "name phone averageRating profilePhoto",
            })
            .populate({
                path: "source",
                select: "name city state",
            })
            .populate({
                path: "destination",
                select: "name city state",
            })
            .populate({
                path: "routeId",
                select:
                    "distanceInKm estimatedDurationInMinutes",
            })
            .sort({
                createdAt: -1,
            });

        return NextResponse.json(
            {
                success: true,
                count: bookings.length,
                bookings,
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