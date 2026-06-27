import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth'
import User from '@/models/user.models'

const editableFields = [
    "name",
    "mobileNumber",
    "address",
    "city",
    "state",
    "pincode",
    "profilePhoto",
];

export async function PATCH(req: NextRequest) {
    try {
        await connectDb();

        const body = await req.json();

        const session = await auth();

        // if (!session?.user?.email) {
        //     return NextResponse.json(
        //         {
        //             message: 'Unauthoized'
        //         },
        //         { status: 401 }
        //     );
        // }

        // const user = await User.findOne({
        //     email: session.user.email
        // })

        const user = await User.findById(body._id);

        if (!user) {
            return NextResponse.json(
                { message: 'user not found' },
                { status: 404 }
            )
        }

        // update 
        editableFields.forEach((field) => {
            if (body[field] !== undefined) {
                user[field] = body[field];
            }
        })


        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Profile Updated',
                user
            },
            { status: 200 }
        )
    }
    catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: 'internal server error',
            },
            {
                status: 500
            }
        )
    }
}