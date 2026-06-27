import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Route from "@/models/Route.models";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";
import Location from "@/models/location.models";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ routeId: string }> }
) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await Admin.findOne({
            email: session.user.email,
        });

        if (!admin) {
            return NextResponse.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        const { routeId } = await params;

        const route = await Route.findOne({
            _id: routeId,
            adminId: admin._id,
        });

        if (!route) {
            return NextResponse.json(
                { message: "Route not found" },
                { status: 404 }
            );
        }

        // Prevent deleting a route that still has vehicles assigned
        const assignedVehicle = await Vehicle.findOne({
            routeId: route._id,
        });

        if (assignedVehicle) {
            return NextResponse.json(
                {
                    message:
                        "Cannot delete route. Vehicles are assigned to it.",
                },
                {
                    status: 400,
                }
            );
        }

        await Route.findByIdAndDelete(route._id);

        return NextResponse.json(
            {
                success: true,
                message: "Route deleted successfully",
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
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ routeId: string }> }
) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await Admin.findOne({
            email: session.user.email,
        });

        if (!admin) {
            return NextResponse.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        const { routeId } = await params;

        const route = await Route.findOne({
            _id: routeId,
            adminId: admin._id,
        });

        if (!route) {
            return NextResponse.json(
                { message: "Route not found" },
                { status: 404 }
            );
        }

        const {
            name,
            source,
            destination,
            stops,
            distanceInKm,
            estimatedDurationInMinutes,
        } = await req.json();

        if (source && !(await Location.exists({ _id: source }))) {
            return NextResponse.json(
                { message: "Invalid source location" },
                { status: 400 }
            );
        }

        if (
            destination &&
            !(await Location.exists({ _id: destination }))
        ) {
            return NextResponse.json(
                { message: "Invalid destination location" },
                { status: 400 }
            );
        }

        if (Array.isArray(stops) && stops.length > 0) {
            const count = await Location.countDocuments({
                _id: { $in: stops },
            });

            if (count !== stops.length) {
                return NextResponse.json(
                    { message: "One or more stops are invalid" },
                    { status: 400 }
                );
            }
        }

        if (name !== undefined) route.name = name;
        if (source !== undefined) route.source = source;
        if (destination !== undefined) route.destination = destination;
        if (stops !== undefined) route.stops = stops;
        if (distanceInKm !== undefined) route.distanceInKm = distanceInKm;
        if (
            estimatedDurationInMinutes !== undefined
        ) {
            route.estimatedDurationInMinutes =
                estimatedDurationInMinutes;
        }

        await route.save();

        return NextResponse.json(
            {
                success: true,
                message: "Route updated successfully",
                route,
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
                message: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}