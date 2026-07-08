import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()

        const { userId, otp, role } = await req.json();
       
        if (!userId || !otp || !role){
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


        if (!account.emailOtpExpiresAt || account.emailOtpExpiresAt < new Date()) {
            return NextResponse.json({
                success: false,
                message: "Otp expired",
                status: 400
            })
        }

        if (account.emailOtp != otp) {
            return NextResponse.json({
                success: false,
                message: "Invalid otp",
                status: 400
            })

        }

        account.emailOtp = undefined;
        account.otpExpiresAt = undefined;

        account.emailVerificationStatus = true;
        if (role === "admin") {
            account.isEmailVerified = true;
        }

        await account.save()

        return NextResponse.json({
            success: true,
            message: "Email verified successfully save the Changes to update your detail",
            status: 200
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "Internal Server error ,Email Verification failed",
            status: 500
        })
    }

}