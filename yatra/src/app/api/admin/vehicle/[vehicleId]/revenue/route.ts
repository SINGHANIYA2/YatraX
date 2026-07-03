import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Booking from "@/models/booking.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const authSession = await auth();

        if (!authSession?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const admin = await Admin.findOne({
            email: authSession.user.email,
        });

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const completedBookings = await Booking.find({
            paymentStatus: "paid",
        });

        const totalRevenue = completedBookings.reduce(
            (sum, booking) => sum + booking.fare,
            0
        );

        const todayRevenue = completedBookings
            .filter(
                booking =>
                    booking.actualEndAt &&
                    booking.actualEndAt >= startOfToday
            )
            .reduce(
                (sum, booking) => sum + booking.fare,
                0
            );

        const weeklyRevenue = completedBookings
            .filter(
                booking =>
                    booking.actualEndAt &&
                    booking.actualEndAt >= startOfWeek
            )
            .reduce(
                (sum, booking) => sum + booking.fare,
                0
            );

        const monthlyRevenue = completedBookings
            .filter(
                booking =>
                    booking.actualEndAt &&
                    booking.actualEndAt >= startOfMonth
            )
            .reduce(
                (sum, booking) => sum + booking.fare,
                0
            );

        const totalCompleted =
            completedBookings.length;

        const cancelledBookings =
            await Booking.countDocuments({
                rideStatus: "cancelled",
            });

        const averageFare =
            totalCompleted > 0
                ? totalRevenue / totalCompleted
                : 0;

        const recentTransactions =
            await Booking.find({
                paymentStatus: "paid",
            })
                .sort({
                    actualEndAt: -1,
                })
                .limit(10)
                .populate({
                    path: "userId",
                    select: "name",
                })
                .populate({
                    path: "partnerId",
                    select: "name",
                })
                .populate({
                    path: "vehicleId",
                    select: "vehicleNumber",
                });

        return NextResponse.json(
            {
                success: true,

                summary: {
                    totalRevenue,
                    todayRevenue,
                    weeklyRevenue,
                    monthlyRevenue,
                    averageFare,
                    totalCompleted,
                    cancelledBookings,
                },

                recentTransactions,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}