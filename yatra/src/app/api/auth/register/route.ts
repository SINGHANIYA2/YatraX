import connectDb from "@/lib/db";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/sendMail";
import { sendOtp } from "@/lib/sendOtp";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, mobileNumber, role } =
            await req.json();

        await connectDb();

        if (!name || !email || !password || !mobileNumber
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Details",
                },
                {
                    status: 400,
                }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must be minimum 6 characters",
                },
                {
                    status: 400,
                }
            );
        }

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                {
                    status: 400,
                }
            );
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const emailOtp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const mobileOtp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            mobileNumber,

            emailOtp,
            mobileOtp,
            otpExpiresAt,

            isEmailVerified: false,
            isMobileVerified: false,
        });

        await sendMail(
            email,
            "Email Verification OTP",
            emailOtp
        );

        await sendOtp(
            mobileNumber.startsWith("+91")
                ? mobileNumber
                : `+91${mobileNumber}`,
            mobileOtp
        );
        return NextResponse.json(
            {
                success: true,
                message:
                    "OTP sent successfully to email and mobile",
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}