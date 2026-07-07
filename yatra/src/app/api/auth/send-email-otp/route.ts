import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()

        const { userId, email, role } = await req.json();

        if (!userId || !email || !role) {
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
                message: "User does not exist"
            })
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        account.emailOtpExpiresAt = otpExpiresAt
        account.emailOtp = otp
        await account.save();

        // call send email
        await sendMail(
            email,
            "Email Verification OTP",
            otp
        )

        return NextResponse.json({
            success: true,
            message: "Otp sent successfully",
            status: 200
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "Internal Server error",
            status: 500
        })
    }
}