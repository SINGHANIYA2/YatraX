import connectDb from "@/lib/db";
import { auth } from "@/auth";
import Admin from "@/models/admin.models";
import vehicleModels from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        await connectDb();
        const {
            vehicleType,
            brand,
            model,
            vehicleNumber,
            seatingCapacity,
            documents,
        } = await req.json();

        // const session = await auth();

        // if (!session?.user?.email) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        // const admin = await Admin.findOne({
        //     email: session?.user?.email 
        // });

        const admin = await Admin.findById(
            "6a3e89c071940960de5b6a2c"
        );

        if (!admin) {
            return NextResponse.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }


        if (
            !vehicleType ||
            !brand ||
            !model ||
            !vehicleNumber ||
            seatingCapacity == null
        ) {
            return NextResponse.json(
                { message: "Please fill all required fields" },
                { status: 400 }
            );
        }

        const formattedVehicleNumber = vehicleNumber
            .trim()
            .toUpperCase();

        const existingVehicle = await vehicleModels.findOne({ vehicleNumber: formattedVehicleNumber });


        if (existingVehicle) {
            return NextResponse.json(
                { message: 'Vehicle already exist' },
                { status: 400 },
            )
        }

        const vehicle = await vehicleModels.create({
            adminId: admin._id,

            vehicleType,
            brand,
            model,
            vehicleNumber: formattedVehicleNumber,
            seatingCapacity,
            documents,

            status: "available",
        })

        await Admin.findByIdAndUpdate(
            admin._id,
            {
                $push: {
                    vehicles: vehicle._id,
                },
                $inc: {
                    totalVehicles: 1,
                }
            }
        )

        return NextResponse.json(
            {
                success: true,
                message: 'Vehicle added Successfully',
                vehicle
            },
            { status: 201 }
        )
    }
    catch (error) {
        console.log(error)

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

