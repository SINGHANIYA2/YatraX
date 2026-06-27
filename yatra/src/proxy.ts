
import { NextResponse, type NextRequest } from 'next/server.js';
import { auth } from './auth';

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
]
const PUBLIC_API = ["/api/auth"]



export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || /\.(png|jpg|jpeg|gif|svg|webp|ico)/i.test(pathname)) {
        return NextResponse.next()
    }

    if (PUBLIC_ROUTES.includes(pathname) || (pathname.startsWith("/api/auth"))) {
        return NextResponse.next()
    }


    if (pathname.startsWith("/api/admin/vehicle")) {
        return NextResponse.next();
    }

    const session = await auth()
    if (!session) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    const role = session.user?.role
    if (pathname.startsWith("/admin")) {
        if (role != "admin") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }
    if (pathname.startsWith("/partner")) {
        if (pathname.startsWith("/partner/onboarding")) {
            return NextResponse.next()
        }

        if (role != "partner") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    if (pathname.startsWith("/api")) {
        if (!session || !session.user) {
            return Response.json({
                message: "Unautorized"
            }, { status: 401 })
        }
    }
    return NextResponse.next()
    console.log(pathname)
}

//middleware jise ni permissison dena ha iss api ka,that is decided by below config  
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}