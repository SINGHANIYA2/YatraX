// src/app/api/vehicle/search/route.ts

import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.models";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
  try {
    await connectDb();

    const { routeIds } = await req.json();

    if (
      !Array.isArray(routeIds) ||
      routeIds.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Route ids are required.",
        },
        {
          status: 400,
        }
      );
    }

    const objectRouteIds = routeIds.map(
      (id: string) =>
        new mongoose.Types.ObjectId(id)
    );

    const vehicles = await Vehicle.find({
      routeId: {
        $in: objectRouteIds,
      },
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
          select:
            "name city latitude longitude",
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




