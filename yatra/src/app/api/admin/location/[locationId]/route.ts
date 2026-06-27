import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params, }: { params: Promise<{ locationId: string; }>; }) {
    try {
        await connectDb();

        const { locationId } = await params;

        if (!locationId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Location id is required",
                },
                {
                    status: 400,
                }
            );
        }

        const admins = await Admin.find({locations: locationId,isAvailable: true, isVerified: true, isBlocked: false,
        }).select(`
            name
            standName
            standAddress
            city
            totalVehicles
            activePartners
        `).lean();

        

        
        return NextResponse.json({
            success: true,
            admins,
        });
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