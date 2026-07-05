import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Booking from "@/models/booking.models";
import Vehicle from "@/models/vehicle.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await Admin.findOne({ email: session.user.email });

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Admin not found" },
                { status: 404 }
            );
        }

        // Every booking belongs to a vehicle owned by this admin,
        // so scope everything through this admin's vehicle IDs.
        const adminVehicleIds = await Vehicle.find({
            adminId: admin._id,
        }).distinct("_id");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const baseMatch = {
            vehicleId: { $in: adminVehicleIds },
            paymentStatus: "paid",
        };

        const [totalAgg, monthAgg, todayAgg, prevMonthAgg] = await Promise.all([
            Booking.aggregate([
                { $match: baseMatch },
                { $group: { _id: null, revenue: { $sum: "$fare" }, count: { $sum: 1 } } },
            ]),

            Booking.aggregate([
                { $match: { ...baseMatch, bookedAt: { $gte: monthStart } } },
                { $group: { _id: null, revenue: { $sum: "$fare" } } },
            ]),

            Booking.aggregate([
                { $match: { ...baseMatch, bookedAt: { $gte: today } } },
                { $group: { _id: null, revenue: { $sum: "$fare" } } },
            ]),

            // previous calendar month, for month-over-month growth
            Booking.aggregate([
                {
                    $match: {
                        ...baseMatch,
                        bookedAt: {
                            $gte: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                            $lt: monthStart,
                        },
                    },
                },
                { $group: { _id: null, revenue: { $sum: "$fare" } } },
            ]),
        ]);

        const totalRevenue = totalAgg[0]?.revenue ?? 0;
        const totalBookings = totalAgg[0]?.count ?? 0;
        const monthlyRevenue = monthAgg[0]?.revenue ?? 0;
        const todayRevenue = todayAgg[0]?.revenue ?? 0;
        const prevMonthRevenue = prevMonthAgg[0]?.revenue ?? 0;

        const growthRate =
            prevMonthRevenue > 0
                ? ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
                : monthlyRevenue > 0
                ? 100
                : 0;

        // Last 6 months chart data
        const monthlyBuckets = await Booking.aggregate([
            {
                $match: {
                    ...baseMatch,
                    bookedAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: { year: { $year: "$bookedAt" }, month: { $month: "$bookedAt" } },
                    revenue: { $sum: "$fare" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        // Build a full 6-month range so months with zero revenue still show up
        const chartData: { month: string; revenue: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const match = monthlyBuckets.find(
                (b) => b._id.year === d.getFullYear() && b._id.month === d.getMonth() + 1
            );
            chartData.push({
                month: monthNames[d.getMonth()],
                revenue: match?.revenue ?? 0,
            });
        }

        // Recent transactions
        const recentBookings = await Booking.find({
            vehicleId: { $in: adminVehicleIds },
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({ path: "userId", select: "name" })
            .populate({ path: "vehicleId", select: "vehicleNumber" });

        const transactions = recentBookings.map((b: any) => ({
            id: `TXN${b._id.toString().slice(-6).toUpperCase()}`,
            bookingId: `BK${b._id.toString().slice(-6).toUpperCase()}`,
            vehicle: b.vehicleId?.vehicleNumber ?? "—",
            customer: b.userId?.name ?? "—",
            amount: b.fare ?? 0,
            status:
                b.paymentStatus === "paid"
                    ? "Paid"
                    : b.paymentStatus === "refunded"
                    ? "Refunded"
                    : b.paymentStatus === "failed"
                    ? "Failed"
                    : "Pending",
            date: new Date(b.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue,
                monthlyRevenue,
                todayRevenue,
                growthRate: Math.round(growthRate * 10) / 10,
                totalBookings,
            },
            chartData,
            transactions,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
