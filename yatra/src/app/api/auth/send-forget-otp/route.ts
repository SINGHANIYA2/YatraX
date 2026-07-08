import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const { email } = await req.json();
        
        if (!email?.trim()) {
           
            return NextResponse.json(
                {
                    success: false,
                    message: "Enter your registered email",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const account =
            (await User.findOne({ email: normalizedEmail })) ||
            (await Admin.findOne({ email: normalizedEmail })) ||
            (await Partner.findOne({ email: normalizedEmail }));

        if (!account) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User does not exist",
                },
                { status: 404 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        account.emailOtp = otp;
        account.emailOtpExpiresAt = otpExpiresAt;
        await account.save();

        await sendMail(normalizedEmail, "Email Verification OTP", otp);

        return NextResponse.json(
            {
                success: true,
                message: "Otp sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server error",
            },
            { status: 500 }
        );
    }
}