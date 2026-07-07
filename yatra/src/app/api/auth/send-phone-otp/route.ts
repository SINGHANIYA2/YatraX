import connectDb from "@/lib/db";
import { sendOtp } from "@/lib/sendOtp";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
// import your SMS service here

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const { userId, mobileNumber, role } = await req.json();

        
            if (!userId || !mobileNumber || !role) {
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

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        account.mobileOtp = otp;
        account.mobileOtpExpiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await account.save();

        await sendOtp(mobileNumber.startsWith("+91")
            ? mobileNumber
            : `+91${mobileNumber}`,
            otp
        );

        // console.log(`Mobile OTP: ${otp}`);

        return NextResponse.json(
            {
                success: true,
                message: "Mobile OTP sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}