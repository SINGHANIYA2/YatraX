import mongoose from "mongoose";
import connectDb from "@/lib/db";
import { auth } from "@/auth";

import Admin from "@/models/admin.models";

import { NextRequest, NextResponse } from "next/server";
import Vehicle from "@/models/vehicle.models";
import Route from "@/models/route.models";

const VEHICLE_TYPES = ["bike", "auto", "cab", "bus"] as const;

console.log(Route)
export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // const admin = await Admin.findOne({
        //     email: session.user.email,
        // });

        const admin = await Admin.findById('6a3e89c071940960de5b6a2c');

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Admin not found" },
                { status: 404 }
            );
        }

        const {
            vehicleType,
            brand,
            model,
            vehicleNumber,
            seatingCapacity,
            documents,
        } = await req.json();

        // --- validation ---

        if (
            !vehicleType ||
            !brand ||
            !model ||
            !vehicleNumber ||
            seatingCapacity == null
        ) {
            return NextResponse.json(
                { success: false, message: "Please fill all required fields" },
                { status: 400 }
            );
        }

        if (!VEHICLE_TYPES.includes(vehicleType)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `vehicleType must be one of: ${VEHICLE_TYPES.join(", ")}`,
                },
                { status: 400 }
            );
        }

        const parsedSeatingCapacity = Number(seatingCapacity);

        if (!Number.isFinite(parsedSeatingCapacity) || parsedSeatingCapacity <= 0) {
            return NextResponse.json(
                { success: false, message: "seatingCapacity must be a positive number" },
                { status: 400 }
            );
        }

        const formattedVehicleNumber = String(vehicleNumber).trim().toUpperCase();

        const existingVehicle = await Vehicle.findOne({
            vehicleNumber: formattedVehicleNumber,
        });

        if (existingVehicle) {
            return NextResponse.json(
                { success: false, message: "Vehicle already exists" },
                { status: 409 }
            );
        }

        const vehicle = await Vehicle.create({
            adminId: admin._id,

            vehicleType,
            brand: String(brand).trim(),
            model: String(model).trim(),
            vehicleNumber: formattedVehicleNumber,

            // availableSeats is required by the schema and starts equal
            // to seatingCapacity since no seats are booked yet
            seatingCapacity: parsedSeatingCapacity,
            availableSeats: parsedSeatingCapacity,

            documents,

            status: "available",
        });

        await Admin.findByIdAndUpdate(admin._id, {
            $push: { vehicles: vehicle._id },
            $inc: { totalVehicles: 1 },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Vehicle added successfully",
                vehicle,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);

        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        if (error?.code === 11000) {
            return NextResponse.json(
                { success: false, message: "Vehicle number already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
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

        const searchParams = req.nextUrl.searchParams;

        const page = Number(searchParams.get("page") ?? 1);

        const limit = Number(searchParams.get("limit") ?? 10);

        const search = searchParams.get("search") ?? "";

        const status = searchParams.get("status");

        const vehicleType = searchParams.get("vehicleType");

        const assigned = searchParams.get("assigned");

        const filter: any = {
            adminId: admin._id,
        };

        if (status) {
            filter.status = status;
        }

        if (vehicleType) {
            filter.vehicleType = vehicleType;
        }

        if (assigned === "true") {
            filter.assignedPartnerId = {
                $ne: null,
            };
        }

        if (assigned === "false") {
            filter.assignedPartnerId = null;
        }

        if (search) {
            filter.$or = [
                {
                    vehicleNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    brand: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    model: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const totalVehicles = await Vehicle.countDocuments(filter);

        const vehicles = await Vehicle.find(filter)
            .populate({
                path: "assignedPartnerId",
                select: `
                    name
                    phone
                    averageRating
                    isOnline
                `,
            })
            .populate({
                path: "routeId",
                select: `
                    distanceInKm
                    estimatedDurationInMinutes
                `,
            })
            .sort({
                createdAt: -1,
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json(
            {
                success: true,

                totalVehicles,

                currentPage: page,

                totalPages: Math.ceil(totalVehicles / limit),

                vehicles,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("GET /api/admin/vehicle error:");
        console.error(error);


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