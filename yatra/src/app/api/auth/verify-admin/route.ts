// app/api/auth/verify-admin/route.ts
//
// Verifies email + mobile OTP for a pending Admin signup (see
// /api/auth/register-admin). This only marks the account as
// email/phone-verified — it still can't log in until organization
// details are submitted via /api/admin/create-profile.

import connectDb from "../../../../../src/lib/db";
import Admin from "../../../../../src/models/admin.models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const { email, emailOtp, mobileNumber, mobileOtp } = await req.json();

    if (!email || !emailOtp || !mobileNumber || !mobileOtp) {
      return NextResponse.json(
        { message: "Email, Mobile Number and OTPs are required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({
      email,
      phone: mobileNumber,
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    if (admin.profileComplete) {
      return NextResponse.json(
        { message: "Admin already verified" },
        { status: 400 }
      );
    }

    if (!admin.otpExpiresAt || admin.otpExpiresAt < new Date()) {
      // Only delete if the profile was never completed — safe, since a
      // completed admin would never reach this branch (profileComplete
      // check above already returns early for those).
      await Admin.deleteOne({ _id: admin._id });

      return NextResponse.json(
        { message: "OTP expired. Please register again." },
        { status: 400 }
      );
    }

    if (admin.emailOtp !== emailOtp) {
      return NextResponse.json(
        { message: "Invalid Email OTP" },
        { status: 400 }
      );
    }

    if (admin.mobileOtp !== mobileOtp) {
      return NextResponse.json(
        { message: "Invalid Mobile OTP" },
        { status: 400 }
      );
    }

    admin.isEmailVerified = true;
    admin.isPhoneVerified = true;
    admin.emailVerificationStatus = true;
    admin.mobileVerificationStatus = true;

    admin.emailOtp = "";
    admin.mobileOtp = "";
    admin.otpExpiresAt = undefined;

    await admin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Email and Mobile verified successfully. Please complete your organization profile.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ADMIN VERIFY ERROR:", error);

    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
