import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { userId, name, email, mobileNumber, role } = await req.json();

        if (!userId || !name || !email || !mobileNumber || !role) {
            return NextResponse.json(
                {
                    message: "Missing details",
                },
                {
                    status: 400,
                }
            );
        }


        let account;
        if (role === "user") {
            account = await User.findById(userId);
        } else if (role === "admin") {
            account = await Admin.findById(userId);
        } else {
            account = await Partner.findById(userId);
        }

        if (!account) {
            return NextResponse.json({
                success: false,
                message: "User does not exist",
                status: 400
            })
        }

        if (!account.emailVerificationStatus) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please verify your email first.",
                },
                { status: 400 }
            );
        }

        if (!account.mobileVerificationStatus) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please verify your mobile number first.",
                },
                { status: 400 }
            );
        }

        account.name = name;
        account.email = email;
        account.phone = mobileNumber;

        account.isEmailVerified = true;
        account.isMobileVerified = true;

        // reset temporary flags
        account.emailVerificationStatus = false;
        account.mobileVerificationStatus = false;

        await account.save();

        await account.save()

        return NextResponse.json({
            success: true,
            message: "Profile upadted successfully"
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            success: true,
            message: "Internal Server error"
        }, { status: 500 })
    }
}