import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const PUBLIC_ROUTES = [
    "/",
    "/contact",
    "/about",
    "/tracking",
    "/fleet",
    "/booking",
    "/routes",
    "/notifications",
    "/admin",
    "/admin/drivers",
    "/admin/fleet",
    "/admin/revenue",
    "/admin/alerts",
    "/admin/applications",
    "/partner/onboarding",
    "/partner/onboarding/bank-details",
    "/partner/onboarding/documents",
    "/partner/onboarding/driver-details",
    "/partner/onboarding/location-admin",
    "/api/profile-update/admin",
    "/api/profile-update/user",
    "/api/profile-update/partner",
    "/api/admin/vehicle",
    "/api/admin/vehicle/assign",
    "/api/admin/location",
    "/api/admin/routes",
    "/api/route/search",
    "/api/vehicle/search",
    "/api/track/getlocation",
]

const PUBLIC_API = [
    "/api/auth",
    "/api/track",
    "/api/vehicle",
    "/api/booking",
];

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow static files
    if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") ||
        /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(pathname)
    ) {
        return NextResponse.next();
    }

    // Allow public APIs
    if (
        PUBLIC_API.some((api) =>
            pathname.startsWith(api)
        )
    ) {
        return NextResponse.next();
    }

    // Allow public pages
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await auth();

    // Not logged in
    if (!session?.user) {
        return NextResponse.redirect(
            new URL("/", req.url)
        );
    }

    const role = session.user.role;

    // Admin routes
    if (
        pathname.startsWith("/admin") &&
        role !== "admin"
    ) {
        return NextResponse.redirect(
            new URL("/", req.url)
        );
    }

    // Partner routes
    if (pathname.startsWith("/partner")) {
        // onboarding allowed for authenticated users
        if (
            pathname.startsWith(
                "/partner/onboarding"
            )
        ) {
            return NextResponse.next();
        }

        if (role !== "partner") {
            return NextResponse.redirect(
                new URL("/", req.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};