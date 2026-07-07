import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth"; // your root auth.ts (NextAuth v5 — exports handlers, signIn, signOut, auth)
import connectDb from "@/lib/db";
import Vehicle, { IVehicle } from "@/models/vehicle.models";
import Partner, { IPartner } from "@/models/partner.models";

export async function GET( req: NextRequest, { params }: { params: { vehicleId: string } }) {
  try {
    const { vehicleId } = await params;

    if (!vehicleId || !mongoose.Types.ObjectId.isValid(vehicleId)) {
      return NextResponse.json(
        { message: "Invalid vehicle id" },
        { status: 400 }
      );
    }

    await connectDb();

    // Auth: only a logged-in user may fetch a vehicle
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const vehicle = await Vehicle.findById(vehicleId).lean<IVehicle>();

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    
    if (session.user.role === "partner") {
      const partner = await Partner.findOne({ userId: session.user.id }).lean<IPartner>();

      if (!partner ||!partner.assignedVehicleId || partner.assignedVehicleId.toString() !== vehicleId) {
        return NextResponse.json(
          { message: "You are not assigned to this vehicle" },
          { status: 403 }
        );
      }
    } else if (session.user.role === "admin") {
      if (vehicle.adminId?.toString() !== session.user.id) {
        return NextResponse.json(
          { message: "This vehicle does not belong to your fleet" },
          { status: 403 }
        );
      }
    }
   

    return NextResponse.json({ vehicle }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/vehicle/[vehicleId] error:", error);
    return NextResponse.json(
      { message: error?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}