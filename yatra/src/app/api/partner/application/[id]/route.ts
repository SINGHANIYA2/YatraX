import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Partner from "@/models/partner.models";
import partnerApplicationModels from "@/models/partnerApplication.models";
import User from "@/models/user.models";

import { NextRequest } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status, reason } = await req.json();

        if (status != 'rejected' && status !== 'approved') {
            return Response.json(
                {
                    success: false,
                    message: "Invalid status",
                },
                {
                    status: 400,
                }
            );
        }

        await connectDb();

        const { id } = await params;

        const application = await partnerApplicationModels.findById(id);

        if (!application) {
            return Response.json(
                { message: 'Application not found' },
                { status: 404 },
            )
        }

        if (status === 'approved') {

            const existingPartner = await Partner.findOne({
                applicationId: application._id
            });

            if (existingPartner) {
                return Response.json(
                    { message: 'Partner already exists' },
                    { status: 400 }
                )
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

            // const partner = await Partner.create({
            //     ...application.toObject(),

            //     applicationId: application._id,

            //     applicationStatus: "approved",

            //     approvedAt: new Date(),

            //     joinedAt: new Date(),
            // });

            await Admin.findByIdAndUpdate(
                application.adminId,
                {
                    $pull: {
                        pendingPartnerRequests: application._id,
                    },
                    $addToSet: {
                        approvedPartners: partner._id,
                    },
                    $inc: {
                        totalPartners: 1,
                        activePartners: 1,
                    },
                }
            );

            // update user
            await User.findByIdAndUpdate(
                application.userId,
                {
                    role: "partner",
                    partnerStatus: "approved",
                    partnerId: partner._id, // if this field exists in User schema
                    partnerApplication: null,
                },
                {
                    new: true,
                }
            );

            // delete application
            await partnerApplicationModels.findByIdAndDelete(application._id);

            return Response.json(
                {
                    success: true,
                    message: 'Partner Approved',
                    partner
                }
            )
        }

        if (status === 'rejected') {

            application.status = "rejected";
            application.rejectionReason = reason;
            application.rejectedAt = new Date();

            await application.save();

            await User.findByIdAndUpdate(
                application.userId,
                {
                    partnerStatus: "rejected",
                    partnerApplication: null,
                }
            );

            await Admin.findByIdAndUpdate(
                application.adminId,
                {
                    $pull: {
                        pendingPartnerRequests: application._id,
                    },
                    $addToSet: {
                        rejectedPartners: application._id,
                    },
                }
            );


            return Response.json(
                {
                    success: true,
                    message: 'Application Rejected',
                    application
                },
                {
                    status: 200,
                }
            )
        }
    }
    catch (error) {
        console.log(error);

        return Response.json(
            {
                success: false,
                message: "Innternal server error",
            },
            { status: 500 }
        )
    }
}