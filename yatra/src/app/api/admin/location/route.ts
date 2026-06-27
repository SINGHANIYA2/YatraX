import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import { NextRequest, NextResponse } from "next/server";
import Location from "@/models/location.models";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        // const session = await auth();

        // if (!session?.user?.email) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "Unauthorized",
        //         },
        //         {
        //             status: 401,
        //         }
        //     );
        // }

        // const admin = await Admin.findOne({
        //     email: session.user.email,
        // });

        // if (!admin) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "Admin not found",
        //         },
        //         {
        //             status: 404,
        //         }
        //     );
        // }

        const { locations } = await req.json();

        if (!Array.isArray(locations) || locations.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Locations array is required",
                },
                {
                    status: 400,
                }
            );
        }

        const formattedLocations = [];

        for (const location of locations) {

            const {
                name,
                city,
                state,
                latitude,
                longitude,
                type,
            } = location;

            if (
                !name ||
                !city ||
                !state ||
                latitude == null ||
                longitude == null ||
                (type !== 'region' && type !== 'stop')
            ) {
                continue;
            }

            const existingLocation = await Location.findOne({
                name: name.trim(),
                city: city.trim(),
                state: state.trim(),
                type,
            });

            if (existingLocation) {
                continue;
            }

            formattedLocations.push({
                name: name.trim(),
                city: city.trim(),
                state: state.trim(),
                latitude: Number(latitude),
                longitude: Number(longitude),
                type
            });

        }

        if (formattedLocations.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No new locations to add",
                },
                {
                    status: 400,
                }
            );
        }

        const createdLocations = await Location.insertMany(formattedLocations);

        return NextResponse.json(
            {
                success: true,
                message: "Locations added successfully",
                count: createdLocations.length,
                locations: createdLocations,
            },
            {
                status: 201,
            }
        );
    }
    catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}