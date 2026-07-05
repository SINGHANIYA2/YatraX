import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ vehicleId: string }> }
) {
    try {
        await connectDb();

        const authSession = await auth();

        if (!authSession?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const admin = await Admin.findOne({
            email: authSession.user.email,
        });

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const { vehicleId } = await params;

        const { status } = await req.json();

        if (
            ![
                "available",
                "maintenance",
            ].includes(status)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid vehicle status.",
                },
                {
                    status: 400,
                }
            );
        }

        const vehicle = await Vehicle.findById(
            vehicleId
        );

        if (!vehicle) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehicle not found.",
                },
                {
                    status: 404,
                }
            );
        }

        if (
            vehicle.adminId.toString() !==
            admin._id.toString()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized.",
                },
                {
                    status: 403,
                }
            );
        }

        // Assigned vehicle cannot be sent to maintenance
        if (
            vehicle.status === "assigned" &&
            status === "maintenance"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unassign the vehicle before sending it to maintenance.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            vehicle.tripStatus !== "idle"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Vehicle is currently on a trip.",
                },
                {
                    status: 400,
                }
            );
        }

        if (vehicle.status === status) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Vehicle already has this status.",
                },
                {
                    status: 400,
                }
            );
        }

        vehicle.status = status;

        await vehicle.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Vehicle status updated successfully.",
                vehicle,
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
                message: "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}