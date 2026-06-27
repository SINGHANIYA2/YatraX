
// import { NextResponse, type NextRequest } from 'next/server.js';
// import { auth } from './auth';

// const PUBLIC_ROUTES = [
//     "/",
//     "/contact",
//     "/about",
//     "/tracking",
//     "/fleet",
//     "/booking",
//     "/routes",
//     "/notifications",
//     "/admin",
//     "/admin/drivers",
//     "/admin/fleet",
//     "/admin/revenue",
//     "/admin/alerts"
// ]
// const PUBLIC_API = ["/api/auth", "/api/track", "api/vehicle", "api/booking"]



// export async function proxy(req: NextRequest) {
//     const { pathname } = req.nextUrl

//     if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || /\.(png|jpg|jpeg|gif|svg|webp|ico)/i.test(pathname)) {
//         return NextResponse.next()
//     }

//     if (PUBLIC_ROUTES.includes(pathname) || (pathname.startsWith("/api/auth"))) {
//         return NextResponse.next()
//     }



//     const session = await auth()
//     if (!session) {
//         return NextResponse.redirect(new URL("/", req.url))
//     }

//     const role = session.user?.role
//     if (pathname.startsWith("/admin")) {
//         if (role != "admin") {
//             return NextResponse.redirect(new URL("/", req.url))
//         }
//     }
//     if (pathname.startsWith("/partner")) {
//         if (pathname.startsWith("/partner/onboarding")) {
//             return NextResponse.next()
//         }

//         if (role != "partner") {
//             return NextResponse.redirect(new URL("/", req.url))
//         }
//     }

//     if (PUBLIC_API.some(api =>pathname.startsWith(api))){
//         return NextResponse.next();
//     }

//     if (!session) {
//         return NextResponse.redirect(
//             new URL("/", req.url)
//         );
//     }

//     if (pathname.startsWith("/api")) {
//         if (!session || !session.user) {
//             return Response.json({
//                 message: "Unautorized"
//             }, { status: 401 })
//         }
//     }
//     return NextResponse.next()
//     console.log(pathname)
// }

// //middleware jise ni permissison dena ha iss api ka,that is decided by below config  
// export const config = {
//     matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
// }

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
];

const PUBLIC_API = [
  "/api/auth",
  "/api/track",
  "/api/vehicle",
  "/api/booking",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
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