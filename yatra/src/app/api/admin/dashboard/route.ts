import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";
import Booking from "@/models/booking.models";
import Partner from "@/models/partner.models";
import Vehicle from "@/models/vehicle.models";
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const monthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        
        // vehicles
        const [
            totalVehicles,
            assignedVehicles,
            availableVehicles,
            maintenanceVehicles,
        ] = await Promise.all([
            Vehicle.countDocuments({
                adminId: admin._id,
            }),

            Vehicle.countDocuments({
                adminId: admin._id,
                status: "assigned",
            }),

            Vehicle.countDocuments({
                adminId: admin._id,
                status: "available",
            }),

            Vehicle.countDocuments({
                adminId: admin._id,
                status: "maintenance",
            }),
        ]);


        // partners
        const [
            totalPartners,
            onlinePartners,
            availablePartners,
        ] = await Promise.all([
            Partner.countDocuments({
                adminId: admin._id,
            }),

            Partner.countDocuments({
                adminId: admin._id,
                isOnline: true,
            }),

            Partner.countDocuments({
                adminId: admin._id,
                isAvailable: true,
            }),
        ]);


        // bookings
        // const [
        //     totalBookings,
        //     runningBookings,
        //     completedBookings,
        //     cancelledBookings,
        //     todayBookings,
        // ] = await Promise.all([
        //     Booking.countDocuments(),

        //     Booking.countDocuments({
        //         rideStatus: "started",
        //     }),

        //     Booking.countDocuments({
        //         rideStatus: "completed",
        //     }),

        //     Booking.countDocuments({
        //         rideStatus: "cancelled",
        //     }),

        //     Booking.countDocuments({
        //         createdAt: {
        //             $gte: today,
        //         },
        //     }),
        // ]);

    
        // revenue
        const revenue = await Booking.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$fare",
                    },

                    averageFare: {
                        $avg: "$fare",
                    },
                },
            },
        ]);

        const monthlyRevenue = await Booking.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    actualEndAt: {
                        $gte: monthStart,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: "$fare",
                    },
                },
            },
        ]);

        const todayRevenue = await Booking.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    actualEndAt: {
                        $gte: today,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: "$fare",
                    },
                },
            },
        ]);


        // recent bookings
        const recentBookings = await Booking.find()
            .sort({
                createdAt: -1,
            })
            .limit(5)
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


        // recent vehicles
        const recentVehicles = await Vehicle.find({
            adminId: admin._id,
        })
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .populate({
                path: "assignedPartnerId",
                select: "name",
            });

        // recent partners
        const recentPartners = await Partner.find({
            adminId: admin._id,
        })
            .sort({
                createdAt: -1,
            })
            .limit(5);

        return NextResponse.json(
            {
                success: true,

                stats: {
                    vehicles: {
                        total: totalVehicles,
                        assigned: assignedVehicles,
                        available: availableVehicles,
                        maintenance: maintenanceVehicles,
                    },

                    partners: {
                        total: totalPartners,
                        online: onlinePartners,
                        available: availablePartners,
                    },

                    // bookings: {
                    //     total: totalBookings,
                    //     today: todayBookings,
                    //     running: runningBookings,
                    //     completed: completedBookings,
                    //     cancelled: cancelledBookings,
                    // },

                    revenue: {
                        total:
                            revenue[0]?.totalRevenue ?? 0,

                        monthly:
                            monthlyRevenue[0]?.revenue ??
                            0,

                        today:
                            todayRevenue[0]?.revenue ??
                            0,

                        averageFare:
                            revenue[0]?.averageFare ?? 0,
                    },
                },

                recentBookings,

                recentVehicles,

                recentPartners,
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