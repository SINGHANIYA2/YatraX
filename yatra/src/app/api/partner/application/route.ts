import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import partnerApplicationModels from "@/models/partnerApplication.models";
import User from "@/models/user.models";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        console.log("BODY RECEIVED:");
        console.log(body);

        await connectDb()
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

        console.log("USER:", user);
        console.log("MOBILE:", user?.mobileNumber);

        if (!user) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const { documents, bankDetails, locationId, adminId, ...driverDetails } = body;

        console.log("DOCUMENTS:", documents);

        if (!adminId || !locationId || !bankDetails || !driverDetails.dlNumber || !documents ||
            !documents?.profilePhoto || !documents?.aadharFront || !documents?.aadharBack ||
            !documents?.drivingLicense
        ) {
            return Response.json(
                {
                    message: "Missing required fields",
                },
                {
                    status: 400,
                }
            );
        }

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return Response.json(
                {
                    message: "Admin not found",
                },
                {
                    status: 404,
                }
            );
        }
        if (!admin.locations.some((id: any) => id.toString() === locationId)) {
            return Response.json(
                {
                    message:
                        "Selected admin does not serve this location",
                },
                {
                    status: 400,
                }
            );
        }

        let application = await partnerApplicationModels.findOne({
            userId: user._id,
            status: {
                $in: ["pending", "under_review", "approved"],
            },
        });

        if (application) {
            return Response.json(
                { message: "Application already submitted", },
                { status: 400 }
            );
        }

        application = await partnerApplicationModels.create({
            userId: user._id,
            adminId,
            locationId,

            name: user.name,
            phone: driverDetails.emergencyContact,
            email: user.email,

            dob: driverDetails.dob,
            gender: driverDetails.gender,

            profilePhoto: documents.profilePhoto,

            dlNumber: driverDetails.dlNumber,
            experience: driverDetails.experience,

            emergencyContact: driverDetails.emergencyContact,

            address: driverDetails.address,
            city: driverDetails.city,
            state: driverDetails.state,
            pincode: driverDetails.pincode,

            aadharNumber: driverDetails.aadharNumber,

            documents: {
                aadharFront: documents.aadharFront,
                aadharBack: documents.aadharBack,
                drivingLicense: documents.drivingLicense,
            },

            bankDetails: {
                accountHolder: bankDetails.accountHolder,
                accountNumber: bankDetails.accountNumber,
                ifsc: bankDetails.ifsc,
                bankName: bankDetails.bankName,
                upiId: bankDetails.upiId,
            },

            status: "pending",
        });

        await Admin.findByIdAndUpdate(
            adminId,
            {
                $addToSet: {
                    pendingPartnerRequests: application._id,
                },
            }
        );

        user.partnerApplication = application._id;
        user.partnerStatus = "pending";

        await user.save();

        console.log("FINAL DOCUMENTS:", documents);

        return Response.json(
            {
                success: true,
                application,
            },
            { status: 201, }
        );
    }
    catch (error) {
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

export async function GET() {
    try {
        await connectDb();

        const applications =
            await partnerApplicationModels.find()
                .sort({ createdAt: -1 });

        return Response.json({
            success: true,
            applications
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            { status: 500 }
        );
    }
}