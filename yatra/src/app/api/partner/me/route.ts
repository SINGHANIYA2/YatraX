import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Partner from "@/models/partner.models";

export async function GET(req: Request) {
    try {
        await connectDb();

        const session = await auth();

        if (!session || !session.user) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const partner = await Partner.findOne({
            email: session.user.email,
        }).populate("adminId", "name standName")
            .populate("locationId", "name city state")
            .populate("assignedVehicleId");

        if (!partner) {
            return Response.json(
                { message: "Partner not found" },
                { status: 404 }
            );
        }

        return Response.json(partner, {
            status: 200,
        });
    } catch (err) {
        return Response.json(
            {
                message: `Internal server error ${err}`,
            },
            {
                status: 500,
            }
        );
    }
}