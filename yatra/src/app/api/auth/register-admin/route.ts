// app/api/auth/register-admin/route.ts
//
// Registration for the "admin" (organization owner) role, kept entirely
// separate from /api/auth/register (which only ever creates a plain User).
// This writes directly to the Admin collection as a not-yet-verified,
// profile-incomplete record. It only becomes a real, loggable-in admin
// after OTP verification (see /api/auth/verify-admin) AND organization
// details are submitted (see /api/admin/create-profile).

import connectDb from "../../../../../src/lib/db";
import Admin from "../../../../../src/models/admin.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "../../../../../src/lib/sendMail";
import { sendOtp } from "../../../../../src/lib/sendOtp";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, mobileNumber } = await req.json();

    await connectDb();

    if (!name || !email || !password || !mobileNumber) {
      return NextResponse.json(
        { success: false, message: "Invalid Details" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be minimum 6 characters" },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { phone: mobileNumber }],
    });

    if (existingAdmin && existingAdmin.profileComplete) {
      return NextResponse.json(
        { success: false, message: "Admin already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const mobileOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existingAdmin && !existingAdmin.profileComplete) {
      // Not-yet-completed signup retrying / resending OTP — update the
      // pending record instead of creating a duplicate.
      existingAdmin.name = name;
      existingAdmin.email = email;
      existingAdmin.phone = mobileNumber;
      existingAdmin.password = hashedPassword;
      existingAdmin.emailOtp = emailOtp;
      existingAdmin.mobileOtp = mobileOtp;
      existingAdmin.otpExpiresAt = otpExpiresAt;
      existingAdmin.isEmailVerified = false;
      existingAdmin.isPhoneVerified = false;
      await existingAdmin.save();
    } else {
      await Admin.create({
        name,
        email,
        phone: mobileNumber,
        password: hashedPassword,
        role: "admin",

        emailOtp,
        mobileOtp,
        otpExpiresAt,

        isEmailVerified: false,
        isPhoneVerified: false,
        isVerified: false,
        profileComplete: false,
      });
    }

    await sendMail(email, "Email Verification OTP", emailOtp);

    await sendOtp(
      mobileNumber.startsWith("+91") ? mobileNumber : `+91${mobileNumber}`,
      mobileOtp
    );

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully to email and mobile",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
