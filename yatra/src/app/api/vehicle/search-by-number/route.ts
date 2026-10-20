import connectDb from "../../../../../src/lib/db";
import Vehicle from "../../../../../src/models/vehicle.models";

import "../../../../../src/models/Route.models";
import "../../../../../src/models/location.models";
import "../../../../../src/models/partner.models";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const vehicleNumber = req.nextUrl.searchParams.get("vehicleNumber");

    if (!vehicleNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle number is required.",
        },
        {
          status: 400,
        }
      );
    }

    const vehicles = await Vehicle.find({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      status: "assigned",
      tripStatus: "running",
      isOnline: true,
    })
      .populate({
        path: "assignedPartnerId",
        select: "name phone",
      })
      .populate({
        path: "routeId",
        populate: {
          path: "locations",
          select: "name city latitude longitude",
        },
      });

    return NextResponse.json(
      {
        success: true,
        count: vehicles.length,
        vehicles,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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