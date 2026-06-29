// src/app/api/vehicle/search-by-number/route.ts

import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  try {
    await connectDb();

    const vehicleNumber =
      req.nextUrl.searchParams.get(
        "vehicleNumber"
      );

    if (!vehicleNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vehicle number is required",
        },
        {
          status: 400,
        }
      );
    }

    const vehicle =
      await Vehicle.findOne({
        vehicleNumber:
          vehicleNumber.toUpperCase().trim(),
      })
        .populate({
          path: "assignedPartnerId",
          select: "name phone",
        })
        .populate({
          path: "routeId",
          populate: {
            path: "locations",
            select:
              "name city latitude longitude",
          },
        });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: 1,
        vehicles: [vehicle],
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
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}