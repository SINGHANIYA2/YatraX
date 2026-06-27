import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth'

const editableFields = [
    "name",
    "phone",
    "profilePhoto",
    "aadharNumber",
    "panNumber",
    "address",
    "city",
    "state",
    "pincode",
    "standName",
    "standAddress",
    "standLatitude",
    "standLongitude",
];


export async function PATCH(req: NextRequest) {
    console.log("PATCH API HIT");
    try {
        await connectDb();

        const body = await req.json();

        // const session = await auth();

        // if (!session?.user?.email) {
        //     return Response.json(
        //         { message: 'Unauthorised' },
        //         { status: 401 }
        //     )
        // }

        // const admin = await Admin.findOne({
        //     email: session.user.email,
        // });

        console.log("BODY:", body);

        const admin = await Admin.findById(body._id);

        console.log("ADMIN:", admin);

        if (!admin) {
            return Response.json(
                { message: 'Admin not found' },
                { status: 404 },
            );
        }

        editableFields.forEach((field) => {
            if (body[field] !== undefined) {
                admin[field] = body[field];
            }
        });

        if (body.documents) {
            admin.documents = {
                ...admin.documents,
                ...body.documents,
            };
        }

        if (body.bankDetails) {
            admin.bankDetails = {
                ...admin.bankDetails,
                ...body.bankDetails
            }
        }

        await admin.save();

        return Response.json(
            {
                success: true,
                message: "Profile Updated",
                admin,
            },
            { status: 200 }
        )
    }
    catch (error) {
        console.log(error);

        return Response.json(
            { message: 'Internal server error' },
            { status: 500 },
        )
    }
}