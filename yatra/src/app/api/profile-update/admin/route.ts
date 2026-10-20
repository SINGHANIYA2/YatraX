import connectDb from "../../../../../src/lib/db";
import Admin from "../../../../../src/models/admin.models";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '../../../../../src/auth'

const editableFields = [
    "name",
    "phone",
    "profilePhoto",
    "aadharNumber",
    "panNumber",
    "address",
    "city",
    "state",
    "pincode",
    "standName",
    "standAddress",
    "standLatitude",
    "standLongitude",
];



export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const body: unknown = await req.json();

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { message: "Invalid request body" },
                { status: 400 }
            );
        }

        const data = body as Record<string, unknown>;

        await connectDb();

        // Find the admin belonging to the logged-in account.
        const admin = await Admin.findOne({
            _id: data._id,
            email: session.user.email,
            role: "admin",
        }).select("_id");

        if (!admin) {
            return NextResponse.json(
                { message: "Admin not found for this session" },
                { status: 404 }
            );
        }

        const allowedFields = [
            "name",
            "phone",
            "alternatePhone",
            "organizationName",
            "organizationType",
            "gstNumber",
            "registrationNumber",
            "aadharNumber",
            "panNumber",
            "address",
            "city",
            "state",
            "pincode",
            "standName",
            "standAddress",
            "standLatitude",
            "standLongitude",
        ];

        const update: Record<string, unknown> = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(data, field)) {
                update[field] = data[field];
            }
        }

        const allowedBankFields = [
            "accountHolder",
            "accountNumber",
            "ifsc",
            "bankName",
            "upiId",
        ];

        if (
            data.bankDetails !== undefined &&
            (typeof data.bankDetails !== "object" ||
                data.bankDetails === null ||
                Array.isArray(data.bankDetails))
        ) {
            return NextResponse.json(
                { message: "Invalid bank details" },
                { status: 400 }
            );
        }

        if (data.bankDetails) {
            const bank = data.bankDetails as Record<string, unknown>;

            for (const field of allowedBankFields) {
                if (Object.prototype.hasOwnProperty.call(bank, field)) {
                    if (typeof bank[field] !== "string") {
                        return NextResponse.json(
                            { message: `Invalid bank field: ${field}` },
                            { status: 400 }
                        );
                    }

                    update[`bankDetails.${field}`] = bank[field];
                }
            }
        }

        if (Object.keys(update).length === 0) {
            return NextResponse.json(
                { message: "No editable fields provided" },
                { status: 400 }
            );
        }

        // Update only supplied paths; don't validate unrelated legacy
        // photo/document objects during a normal profile update.
        const updatedAdmin = await Admin.findOneAndUpdate(
            {
                _id: admin._id,
                email: session.user.email,
                role: "admin",
            },
            { $set: update },
            {
                new: true,
                runValidators: false,
            }
        ).select("-password -otp -emailOtp -mobileOtp");

        if (!updatedAdmin) {
            return NextResponse.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            admin: updatedAdmin,
        });
    } catch (error) {
        console.error("Admin profile update error:", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
