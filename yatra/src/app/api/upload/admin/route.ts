import { NextRequest } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Admin from "@/models/admin.models";

const DOC_FIELDS = ["rc", "insurance", "pollution"] as const;

type DocField = (typeof DOC_FIELDS)[number];

export async function POST(req: NextRequest) {
    try {
        await connectDb();

        const session = await auth();

        if (!session?.user?.email) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // const admin = await Admin.findOne({
        //     email: session.user.email,
        // });

        const admin = await Admin.findById('6a3e89c071940960de5b6a2c');

        if (!admin) {
            return Response.json(
                { message: "Admin not found" },
                { status: 404 }
            );
        }

        const formData = await req.formData();

        // vehicle documents are optional, so only whichever of
        // rc / insurance / pollution were sent get uploaded
        const filesToUpload = DOC_FIELDS.reduce((acc, field) => {
            const file = formData.get(field) as File | null;
            if (file) acc[field] = file;
            return acc;
        }, {} as Record<DocField, File>);

        if (Object.keys(filesToUpload).length === 0) {
            return Response.json(
                {
                    message:
                        "Send at least one of: rc, insurance, pollution",
                },
                { status: 400 }
            );
        }

        const documents: Record<string, any> = {};

        for (const field of Object.keys(filesToUpload) as DocField[]) {
            const uploaded = await uploadOnCloudinary(
                filesToUpload[field]
            );

            if (!uploaded) {
                return Response.json(
                    {
                        message: `Failed to upload ${field}`,
                    },
                    { status: 500 }
                );
            }

            documents[field] = uploaded;
        }

        return Response.json(
            {
                success: true,
                documents,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}