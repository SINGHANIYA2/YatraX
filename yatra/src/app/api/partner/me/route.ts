import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Partner from "@/models/partner.models";



export async function GET(req: Request) {
    try {
        await connectDb();

        const session = await auth();

        console.log(session);

        if (!session || !session?.user) {
            console.log(session?.user?.email)
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

<<<<<<< HEAD
        return Response.json(partner, {
            status: 200,
        });

=======
        return Response.json(partner,
            {
                status: 200,
            }
        );
>>>>>>> a3afb67d23d53bb6365f8489ab63d00f4b008582
    } catch (err) {
        console.error(err);

        return Response.json(
            {
                message: "Internal Server Error",
                error: err instanceof Error ? err.message : err,
            },
            { status: 500 }
        );
    }
}