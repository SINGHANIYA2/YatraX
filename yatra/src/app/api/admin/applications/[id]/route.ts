import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import PartnerApplication from "@/models/partnerApplication.models";
import User from "@/models/user.models";
import { NextRequest } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await Admin.findOne({ email: session.user.email });

        if (!admin) {
            return Response.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        const { status, reason } = await req.json();

        if (status !== "rejected" && status !== "approved") {
            return Response.json(
                { success: false, message: "Invalid status" },
                { status: 400 }
            );
        }

        const { id } = await params;

        const application = await PartnerApplication.findById(id);

        if (!application) {
            return Response.json(
                { message: "Application not found" },
                { status: 404 }
            );
        }

        // Ensure this application belongs to the admin
        if (application.adminId.toString() !== admin._id.toString()) {
            return Response.json(
                { message: "Forbidden: Application does not belong to your admin account" },
                { status: 403 }
            );
        }

        if (application.status !== "pending" && application.status !== "under_review") {
            return Response.json(
                { message: `Application is already ${application.status}` },
                { status: 400 }
            );
        }

        if (status === "approved") {
            const existingPartner = await Partner.findOne({
                applicationId: application._id,
            });

            if (existingPartner) {
                return Response.json(
                    { message: "Partner already exists" },
                    { status: 400 }
                );
            }

            const partner = await Partner.create({
                userId: application.userId,
                applicationId: application._id,
                adminId: application.adminId,
                locationId: application.locationId,

                name: application.name,
                phone: application.phone,
                email: application.email,

                dob: application.dob,
                gender: application.gender,

                profilePhoto: application.profilePhoto,

                emergencyContact: application.emergencyContact,

                address: application.address,
                city: application.city,
                state: application.state,
                pincode: application.pincode,

                dlNumber: application.dlNumber,
                experience: application.experience,

                aadharNumber: application.aadharNumber,

                documents: application.documents,

                bankDetails: application.bankDetails,

                applicationStatus: "approved",

                approvedAt: new Date(),

                joinedAt: new Date(),
            });

            await Admin.findByIdAndUpdate(application.adminId, {
                $pull: { pendingPartnerRequests: application._id },
                $addToSet: { approvedPartners: partner._id },
                $inc: { totalPartners: 1, activePartners: 1 },
            });

            await User.findByIdAndUpdate(application.userId, {
                role: "partner",
                partnerStatus: "approved",
                partnerId: partner._id,
                partnerApplication: null,
            });

            // Delete the application after approval
            await PartnerApplication.findByIdAndDelete(application._id);

            return Response.json({
                success: true,
                message: "Partner Approved",
                partner,
            });
        }

        if (status === "rejected") {
            if (!reason || !reason.trim()) {
                return Response.json(
                    { message: "Rejection reason is required" },
                    { status: 400 }
                );
            }

            application.status = "rejected";
            application.rejectionReason = reason;
            application.rejectedAt = new Date();

            await application.save();

            await User.findByIdAndUpdate(application.userId, {
                partnerStatus: "rejected",
                partnerApplication: null,
            });

            await Admin.findByIdAndUpdate(application.adminId, {
                $pull: { pendingPartnerRequests: application._id },
                $addToSet: { rejectedPartners: application._id },
            });

            return Response.json({
                success: true,
                message: "Application Rejected",
                application,
            });
        }

    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
