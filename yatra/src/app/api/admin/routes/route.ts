import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Location from "@/models/location.models";
import Route from "@/models/Route.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        console.log('api called');
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

        const admin = await Admin.findById(
            "6a3e89c071940960de5b6a2c"
        );

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin not found",
                },
                {
                    status: 404,
                }
            );
        }

        const {
            locations,
            distanceInKm,
            estimatedDurationInMinutes,
        } = await req.json();



        if (
            !Array.isArray(locations) ||
            locations.length < 2
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A route must contain at least two locations.",
                },
                {
                    status: 400,
                }
            );
        }

        // Prevent duplicate locations
        if (new Set(locations).size !== locations.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Duplicate locations are not allowed.",
                },
                {
                    status: 400,
                }
            );
        }

        // Validate locations
        const existingLocations = await Location.find({
            _id: { $in: locations },
            isActive: true,
            type: "stop",
        }).select("_id");

        if (existingLocations.length !== locations.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "One or more locations are invalid.",
                },
                {
                    status: 400,
                }
            );
        }

        // Prevent duplicate route (same ordered path)
        const existingRoutes = await Route.find({
            adminId: admin._id,
        });

        const duplicateRoute = existingRoutes.find((route) => {
            if (route.locations.length !== locations.length) return false;

            return route.locations.every(
                (id: any, index: number) =>
                    id.toString() === locations[index]
            );
        });

        if (duplicateRoute) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Route already exists.",
                },
                {
                    status: 409,
                }
            );
        }

        const route = await Route.create({
            adminId: admin._id,
            locations,
            distanceInKm: distanceInKm ?? 0,
            estimatedDurationInMinutes:
                estimatedDurationInMinutes ?? 0,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Route created successfully.",
                route,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log(error);

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