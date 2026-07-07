import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.models";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ vehicleId: string }> }
) {
  try {
    await connectDb();

    const { vehicleId } = await params;

    if (!vehicleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle id is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid vehicle id",
        },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,

        vehicleId: vehicle._id,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.vehicleType,

        currentLatitude: vehicle.currentLatitude,
        currentLongitude: vehicle.currentLongitude,

        speed: vehicle.speed,
        heading: vehicle.heading,

        isOnline: vehicle.isOnline,
        tripStatus: vehicle.tripStatus,

        lastLocationUpdate: vehicle.lastLocationUpdate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
