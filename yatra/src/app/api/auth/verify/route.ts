import connectDb from "@/lib/db";
import User from "@/models/user.models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();

    const {
      email,
      emailOtp,
      mobileNumber,
      mobileOtp,
    } = await req.json();

    if (
      !email ||
      !emailOtp ||
      !mobileNumber ||
      !mobileOtp
    ) {
      return NextResponse.json(
        {
          message:
            "Email, Mobile Number and OTPs are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      email,
      mobileNumber,
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (user.isEmailVerified && user.isMobileVerified
    ) {
      return NextResponse.json(
        {
          message: "User already verified",
        },
        {
          status: 400,
        }
      );
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()
    ) {
      await User.deleteOne({
        _id: user._id,
      });

      return NextResponse.json(
        {
          message:
            "OTP expired. Please register again.",
        },
        {
          status: 400,
        }
      );
    }

    if (user.emailOtp !== emailOtp) {
      return NextResponse.json(
        {
          message: "Invalid Email OTP",
        },
        {
          status: 400,
        }
      );
    }

    if (user.mobileOtp !== mobileOtp) {
      return NextResponse.json(
        {
          message: "Invalid Mobile OTP",
        },
        {
          status: 400,
        }
      );
    }

    user.isEmailVerified = true;
    user.isMobileVerified = true;

    user.emailOtp = "";
    user.mobileOtp = "";

    user.otpExpiresAt = undefined;
    user.isVerified = true

    if (!user.isVerified) {
      throw new Error("Please verify your account first");
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Email and Mobile verified successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      {
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