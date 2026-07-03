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
                    message: "Admin not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const searchParams = req.nextUrl.searchParams;

        const page = Number(searchParams.get("page") ?? 1);

        const limit = Number(searchParams.get("limit") ?? 10);

        const search = searchParams.get("search") ?? "";

        const available = searchParams.get("available");

        const filter: any = {
            adminId: admin._id,
            applicationStatus: "approved",
        };

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

        const partners = await Partner.find(filter)
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
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json(
            {
                success: true,

                totalPartners,

                currentPage: page,

                totalPages: Math.ceil(
                    totalPartners / limit
                ),

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