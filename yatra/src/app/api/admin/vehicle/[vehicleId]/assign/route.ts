import connectDb from "@/lib/db";
import Partner from "@/models/partner.models";
import { auth } from "@/auth";
import Route from "@/models/Route.models";
import Admin from "@/models/admin.models";
import vehicleModels from "@/models/vehicle.models";
import { NextRequest } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ vehicleId: string }> }
) {
    try {

        await connectDb();

        // const session = await auth();

        // if (!session?.user?.email) {
        //     return Response.json(
        //         { message: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        // const admin = await Admin.findOne({
        //     email: session.user.email,
        // });

        const admin = await Admin.findById(
            "6a3e89c071940960de5b6a2c"
        );

        if (!admin) {
            return Response.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        const { vehicleId } = await params;

        const { partnerId, routeId } = await req.json();

        if (!partnerId || !routeId) {
            return Response.json(
                {
                    message: "Partner ID and Route ID are required",
                },
                {
                    status: 400,
                }
            );
        }



        const vehicle = await vehicleModels.findOne({
            _id: vehicleId,
            adminId: admin._id,
        });

        if (!vehicle) {
            return Response.json(
                { message: "Vehicle not found" },
                { status: 404 }
            );
        }

        if (vehicle.status !== "available") {
            return Response.json(
                {
                    message: "Vehicle is not available for assignment",
                },
                {
                    status: 400,
                }
            );
        }

        if (vehicle.routeId) {
            return Response.json(
                {
                    message: "Vehicle is already assigned to a route.",
                },
                {
                    status: 400,
                }
            );
        }

        const partner = await Partner.findOne({
            _id: partnerId,
            adminId: admin._id,
        });

        if (!partner) {
            return Response.json(
                { message: "Partner not found" },
                { status: 404 }
            );
        }

        if (partner.assignedVehicleId) {
            return Response.json(
                { message: "Partner already has a vehicle" },
                { status: 400 }
            );
        }
        if (!partner.isAvailable) {
            return Response.json(
                {
                    message: "Partner is not available",
                },
                {
                    status: 400,
                }
            );
        }

        const route = await Route.findOne({
            _id: routeId,
            adminId: admin._id,
            isActive: true,
        });

        if (!route) {
            return Response.json(
                {
                    message: "Route not found",
                },
                {
                    status: 404,
                }
            );
        }

        vehicle.assignedAt = new Date();
        vehicle.assignedPartnerId = partner._id;
        vehicle.routeId = route._id;
        vehicle.status = "assigned";

        await vehicle.save();

        partner.assignedVehicleId = vehicle._id;
        partner.isAvailable = false;

        await partner.save();

        await Admin.findByIdAndUpdate(admin._id, {
            $inc: {
                activeVehicles: 1,
            },
        });

        return Response.json(
            {
                success: true,
                message: "Vehicle assigned successfully",
                vehicleId: vehicle._id,
                partnerId: partner._id,
                routeId: route._id
            },
            {
                status: 200,
            }
        );
    }
    catch (error) {
        console.log(error);

        return Response.json(
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