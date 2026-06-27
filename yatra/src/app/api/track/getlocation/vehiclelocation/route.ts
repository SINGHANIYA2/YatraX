import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const { vehicleNumber } = await req.json()

        if (!vehicleNumber) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle number is required",
                },
                {
                    status: 400,
                }
            );
        }
        
        const vehicle = await Vehicle.findOne({ vehicleNumber });
        if (!vehicle) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle not found",
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                currentLatitude: vehicle.currentLatitude,
                currentLongitude: vehicle.currentLongitude,
            },
            {
                status: 200,
            }
        )
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