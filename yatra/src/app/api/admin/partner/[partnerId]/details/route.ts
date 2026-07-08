import connectDb from "@/lib/db";
import { auth } from "@/auth";

import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import Vehicle from "@/models/vehicle.models";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ partnerId: string }> }
) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await Admin.findOne({
            email: session.user.email,
        });

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Admin not found" },
                { status: 404 }
            );
        }

        const { partnerId } = await params;

        const partner = await Partner.findOne({
            _id: partnerId,
            adminId: admin._id,
        })
            .populate({
                path: "assignedVehicleId",
                select: "vehicleType brand model vehicleNumber status",
            })
            .lean();

        if (!partner) {
            return NextResponse.json(
                { success: false, message: "Partner not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, partner: partner },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}