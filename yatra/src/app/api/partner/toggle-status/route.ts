import connectDb from "@/lib/db";
import Partner from "@/models/partner.models";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import Vehicle from "@/models/vehicle.models";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { partnerId, isOnline } = await req.json();

    if (!partnerId || typeof isOnline !== "boolean") {
      return NextResponse.json(
        { success: false, message: "partnerId and isOnline are required" },
        { status: 400 }
      );
    }

    if (session.user.role !== "partner" || session.user.id !== partnerId) {
      return NextResponse.json(
        { success: false, message: "You can only update your own status" },
        { status: 403 }
      );
    }

    const partner = await Partner.findOneAndUpdate(
      { userId: partnerId },
      {
        isOnline,
        lastSeen: new Date(),
      },
      { new: true }
    );

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 }
      );
    }

    // Keep the assigned vehicle's online/trip status in sync with the partner
    if (partner.assignedVehicleId) {
      await Vehicle.findByIdAndUpdate(
        partner.assignedVehicleId,
        isOnline
          ? {
              isOnline: true,
            }
          : {
              isOnline: false,
              tripStatus: "idle",
              currentLatitude: null,
              currentLongitude: null,
              speed: 0,
              heading: 0,
              lastLocationUpdate: null,
            },
        { new: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isOnline: partner.isOnline,
        lastSeen: partner.lastSeen,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}