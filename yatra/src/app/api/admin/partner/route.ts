import { auth } from "@/auth";
import connectDb from "@/lib/db";

import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import Vehicle from "@/models/vehicle.models";

import { NextRequest, NextResponse } from "next/server";
console.log(Partner)
console.log(Vehicle)

export async function GET(req: NextRequest) {
    try {

        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
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
            email: session.user.email,
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

        const searchParams = req.nextUrl.searchParams;

        const page = Number(searchParams.get("page") ?? 1);

        // No limit by default -> return every matching driver.
        // Callers that explicitly want pagination can still pass ?limit=NN.
        const limitParam = searchParams.get("limit");

        const limit = limitParam ? Number(limitParam) : 0;

        const search = searchParams.get("search") ?? "";

        const available = searchParams.get("available");

        // Only the Assign Driver modal should ask for unassigned/available
        // drivers specifically. The main Drivers Management page wants
        // every driver regardless of assignment status.
        const availableOnly =
            searchParams.get("availableOnly") === "true";

        const filter: any = {
            adminId: admin._id,
            applicationStatus: "approved",
        };

        if (availableOnly) {
            filter.assignedVehicleId = null;
            filter.isAvailable = true;
        }

        if (available === "true") {
            filter.isAvailable = true;
        }

        if (available === "false") {
            filter.isAvailable = false;
        }

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const totalPartners =
            await Partner.countDocuments(filter);

        let partnersQuery = Partner.find(filter)
            .populate({
                path: "assignedVehicleId",
                select: `
                    vehicleNumber
                    vehicleType
                    brand
                    model
                    status
                `,
            })
            .sort({
                createdAt: -1,
            });

        // Only paginate when a limit was explicitly requested.
        if (limit > 0) {
            partnersQuery = partnersQuery
                .skip((page - 1) * limit)
                .limit(limit);
        }

        const partners = await partnersQuery.lean();

        return NextResponse.json(
            {
                success: true,

                totalPartners,

                currentPage: page,

                totalPages: limit > 0 ? Math.ceil(
                    totalPartners / limit
                ) : 1,

                partners,
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