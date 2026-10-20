import connectDb from "../../../../../src/lib/db";
import Route from "../../../../../src/models/Route.models";
import Location from "../../../../../src/models/location.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();

        const source = req.nextUrl.searchParams.get("source");

        const destination = req.nextUrl.searchParams.get("destination");


        if (!source || !destination) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Source and destination are required.",
                },
                {
                    status: 400,
                }
            );
        }

        const sourceLocation = await Location.findOne({
            isActive: true,
            $or: [
                { city: new RegExp(`^${source}$`, "i") },
                { name: new RegExp(`^${source}$`, "i") }
            ]
        });

        const destinationLocation = await Location.findOne({
            isActive: true,
            $or: [
                { city: new RegExp(`^${destination}$`, "i") },
                { name: new RegExp(`^${destination}$`, "i") }
            ]
        });

        // console.log("Source Location =", sourceLocation);
        // console.log("Destination Location =", destinationLocation);

        if (!sourceLocation || !destinationLocation) {
            console.log("loaction error")
            return NextResponse.json(
                {
                    success: false,
                    message: "Source or destination not found.",
                },
                {
                    status: 400,
                }
            );
        }

        const routes = await Route.find({
            isActive: true,
            locations: {
                $all: [
                    sourceLocation._id,
                    destinationLocation._id,
                ],
            },
        }).select("_id locations");

        const routeIds = routes.filter((route) => {
            const locations = route.locations.map(
                (id: any) =>
                    id.toString()
            );

            const sourceIndex = locations.indexOf(
                sourceLocation._id.toString()
            );

            const destinationIndex = locations.indexOf(
                destinationLocation._id.toString()
            );

            return (
                sourceIndex !== -1 &&
                destinationIndex !== -1 &&
                sourceIndex < destinationIndex
            );
        })
            .map((route) => route._id);

        return NextResponse.json(
            {
                success: true,
                count: routeIds.length,
                routeIds,
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

