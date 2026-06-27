import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params, }: { params: Promise<{ vehicleId: string }>; }) {
    try {
        await connectDb()
        const { vehicleId } = await params

        if (!vehicleId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle id is required",
                },
                {
                    status: 400,
                }
            );
        }
        console.log("VehicleId:", vehicleId);
        console.log("Type:", typeof vehicleId);
        console.log("Length:", vehicleId.length);
        console.log(
        "All vehicles:",
        await Vehicle.find({}, "_id")
        );
        console.log(process.env.MONGODB_URI);
        console.log(await Vehicle.countDocuments());

        const vehicle = await Vehicle.findById(vehicleId)
        if (!vehicle) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle not found"
                },
                { status: 400 }
            )
        }


        console.log(vehicle);

        return NextResponse.json(
            {
                success: true,
                currentLatitude: vehicle.currentLatitude,
                currentLongitude: vehicle.currentLongitude,
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
                message: "Failed to fetch admins",
            },
            {
                status: 500,
            }
        );
    }
}