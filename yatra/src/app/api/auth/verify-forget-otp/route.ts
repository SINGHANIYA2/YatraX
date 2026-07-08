import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const { email, otp } = await req.json();

        if (!email?.trim() || !otp?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email and OTP are required.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedOtp = otp.trim();

        const account =
            (await User.findOne({ email: normalizedEmail })) ||
            (await Admin.findOne({ email: normalizedEmail })) ||
            (await Partner.findOne({ email: normalizedEmail }));

        if (!account) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No account found with this email.",
                },
                { status: 404 }
            );
        }

        if (
            !account.emailOtp ||
            !account.emailOtpExpiresAt ||
            account.emailOtpExpiresAt < new Date()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "OTP has expired.",
                },
                { status: 400 }
            );
        }

        if (account.emailOtp !== normalizedOtp) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid OTP.",
                },
                { status: 400 }
            );
        }

        // Clear OTP after successful verification
        account.emailOtp = undefined;
        account.emailOtpExpiresAt = undefined;
        await account.save();

        return NextResponse.json(
            {
                success: true,
                message: "OTP verified successfully. You can now reset your password.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error.",
            },
            { status: 500 }
        );
    }
}