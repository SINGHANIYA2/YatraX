import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const { userId, otp, role } = await req.json();
        if (!userId || !otp || !role) {
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
            return NextResponse.json(
                {
                    success: false,
                    message: "User does not exist",
                },
                { status: 404 }
            );
        }

        if (!account.mobileOtpExpiresAt || account.mobileOtpExpiresAt < new Date()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "OTP expired",
                },
                { status: 400 }
            );
        }

        if (account.mobileOtp !== otp) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OTP",
                },
                { status: 400 }
            );
        }

        account.mobileOtp = undefined;
        account.mobileOtpExpiresAt = undefined;
        account.mobileVerificationStatus = true;

        await account.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Mobile verified successfully. Save the changes to update your details.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error, Mobile Verification failed",
            },
            { status: 500 }
        );
    }
}