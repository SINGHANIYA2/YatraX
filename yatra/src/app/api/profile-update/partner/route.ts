import { auth } from '@/auth'
import connectDb from "@/lib/db";
import Partner from '@/models/partner.models'
import { NextRequest, NextResponse } from "next/server";

const editableFields = [
    "name",
    "phone",
    "profilePhoto",
    "address",
    "city",
    "state",
    "pincode",
    "emergencyContact",
    "bankDetails",
];

export async function PATCH(req: NextRequest) {
    try {
        await connectDb();

        const body = await req.json();

        // const session = await auth();

        // if (!session?.partner?.email) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        // const partner = await Partner.findOne({
        //     email: session.partner.email,
        // });

        const partner = await Partner.findById(body._id);

        if (!partner) {
            return NextResponse.json(
                { message: 'Partner Not Found' },
                { status: 404 }
            )
        }

        editableFields.forEach((field) => {
            if (body[field] !== undefined) {
                partner[field] = body[field]
            }
        })

        if (body.bankDetails) {
            partner.bankDetails = {
                ...partner.bankDetails,
                ...body.bankDetails,
            };
        }

        if (body.documents) {
            partner.documents = {
                ...partner.documents,
                ...body.documents,
            };
        }

        await partner.save();

        return NextResponse.json(
            {
                success: true,
                message: "Profile Updated",
                partner
            },
            { status: 200 }
        )
    }
    catch (error) {
        console.log(error)

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}