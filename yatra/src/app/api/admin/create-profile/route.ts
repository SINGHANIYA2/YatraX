// app/api/admin/create-profile/route.ts
//
// Final step of admin onboarding: fills in organization + bank details on
// an already OTP-verified (but profile-incomplete) Admin record created by
// /api/auth/register-admin + /api/auth/verify-admin. This no longer
// bridges through a temporary User document — it updates the real Admin
// record in place.

import connectDb from "../../../../../src/lib/db";
import Admin from "../../../../../src/models/admin.models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const {
      email,
      organizationName,
      organizationType,
      gstNumber,
      panNumber,
      registrationNumber,
      address,
      city,
      state,
      pincode,
      totalVehicles,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      upiId,
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found. Please sign up first." },
        { status: 404 }
      );
    }

    if (!admin.isEmailVerified || !admin.isPhoneVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email and mobile OTP first" },
        { status: 403 }
      );
    }

    if (admin.profileComplete) {
      return NextResponse.json(
        { success: false, message: "Admin profile is already complete" },
        { status: 400 }
      );
    }

    admin.organizationName = organizationName;
    admin.organizationType = organizationType;
    admin.gstNumber = gstNumber;
    admin.registrationNumber = registrationNumber;
    admin.panNumber = panNumber;
    admin.address = address;
    admin.city = city;
    admin.state = state;
    admin.pincode = pincode;
    admin.totalVehicles = Number(totalVehicles);

    admin.bankDetails = {
      bankName,
      accountHolder: accountHolderName,
      accountNumber,
      ifsc: ifscCode,
      upiId,
    };

    admin.isVerified = true;
    admin.profileComplete = true;

    await admin.save();

    const { password: _password, ...adminSafe } = admin.toObject();

    return NextResponse.json(
      {
        success: true,
        message: "Admin profile created successfully",
        admin: adminSafe,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Failed to create admin profile" },
      { status: 500 }
    );
  }
}
