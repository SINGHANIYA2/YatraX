import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import PartnerApplication from "@/models/partnerApplication.models";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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

        // Fetch only applications belonging to this admin
        const applications = await PartnerApplication.find({
            adminId: admin._id,
        }).sort({ createdAt: -1 });

        return Response.json({
            success: true,
            applications,
        });

    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
