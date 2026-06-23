import { NextRequest } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.models";

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findOne({
            email: session.user.email,
        });

        if (!user) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const formData = await req.formData();

        const aadharBack = formData.get(
            "aadharBack"
        ) as File | null;

        const aadharFront = formData.get(
            "aadharFront"
        ) as File | null;

        const profilePhoto = formData.get(
            "profilePhoto"
        ) as File | null;

        const drivingLicense = formData.get(
            "drivingLicense"
        ) as File | null;

        if (!aadharBack || !aadharFront || !profilePhoto || !drivingLicense) {
            return Response.json(
                { message: "Missing required documents" },
                { status: 400 }
            );
        }

        const documents: any = {};

        const aadharBackData = await uploadOnCloudinary(aadharBack);
        console.log("AADHAR BACK:", aadharBackData);

        if (!aadharBackData) {
            return Response.json(
                { message: "Failed to upload Aadhaar Back" },
                { status: 500 }
            );
        }

        documents.aadharBack = aadharBackData;



        const aadharFrontData = await uploadOnCloudinary(aadharFront);
        console.log("AADHAR FRONT:", aadharFrontData);

        if (!aadharFrontData) {
            return Response.json(
                { message: "Failed to upload Aadhaar Front" },
                { status: 500 }
            );
        }

        documents.aadharFront = aadharFrontData;



        const drivingLicenseData = await uploadOnCloudinary(drivingLicense);
        console.log("DL:", drivingLicenseData);

        if (!drivingLicenseData) {
            return Response.json(
                { message: "Failed to upload Driving License" },
                { status: 500 }
            );
        }

        documents.drivingLicense = drivingLicenseData;



        const profilePhotoData = await uploadOnCloudinary(profilePhoto);
        console.log("PHOTO:", profilePhotoData);

        if (!profilePhotoData) {
            return Response.json(
                { message: "Failed to upload Profile Photo" },
                { status: 500 }
            );
        }

        documents.profilePhoto = profilePhotoData;

        console.log("FINAL DOCUMENTS:", documents);

        console.log("Documents uploaded successfully");

        return Response.json(
            {
                success: true,
                documents,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}