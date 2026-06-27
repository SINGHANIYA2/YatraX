import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Location from "@/models/location.models";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const query = req.nextUrl.searchParams.get("q") || "";

        if (query.length < 2) {
            return NextResponse.json({
                success: false,
                locations: [],
            });
        }

        const locations = await Location.find({
            isActive: true,
            name: {
                $regex: "^" + query,
                $options: "i",
            },
            type:"region"
        }).select("_id name").limit(10);

        return NextResponse.json({
            success: true,
            locations,
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to search locations",
            },
            {
                status: 500,
            }
        );
    }
}