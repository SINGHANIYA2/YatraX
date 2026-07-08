import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const { email, password } = await req.json();

        if (!email?.trim() || !password?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email and password are required.",
                },
                { status: 400 }
            );
        }

        if (password.trim().length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password must be at least 6 characters.",
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
                    message: "No account found with this email.",
                },
                { status: 404 }
            );
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        account.password = hashedPassword;

        // Defensive cleanup — in case verify step didn't already clear these
        account.emailOtp = undefined;
        account.emailOtpExpiresAt = undefined;

        await account.save();

        return NextResponse.json(
            {
                success: true,
                message: "Password changed successfully.",
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