# YatraX — Smart Transport Management & Live Vehicle Tracking

<p align="center">
  <strong>Search. Book. Track.</strong><br/>
  A full-stack transport platform for trip discovery, bookings, partner onboarding, fleet administration, route management, and live vehicle location updates.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.IO-Real--time-black?style=for-the-badge&logo=socketdotio" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
</p>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Roles](#roles)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Run and Build](#run-and-build)
- [Main Workflows](#main-workflows)
- [Real-Time Tracking](#real-time-tracking)
- [Fare Calculation](#fare-calculation)
- [API Overview](#api-overview)
- [Data Models](#data-models)
- [Security Checklist](#security-checklist)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)
- [License](#license)

## Overview

**YatraX** is a full-stack transport management and trip-booking application. It provides role-based experiences for passengers, transport partners/drivers, and administrators. The Next.js application handles the user interface and HTTP APIs; MongoDB stores application data through Mongoose; a separate Node.js/Socket.IO server handles real-time vehicle-location and trip-status events.

The repository contains two separately run applications:

- **`yatra/`** — Next.js web application, App Router pages, API routes, models, and shared client code.
- **`socketServer/`** — standalone Express and Socket.IO server for live updates and an internal trip-status relay endpoint.

The web application includes trip and vehicle search, booking and payment-related routes, partner onboarding/review, vehicle assignment, route/location/schedule administration, dashboards, and map-based tracking.

> **Build status:** The web application has successfully completed `npm run build` in the development environment. This verifies compilation and TypeScript checks, but external integrations and all runtime flows still need end-to-end testing with correctly configured services.

## Features

### Passenger / User

- Credentials-based and Google sign-in.
- User profile endpoint and account-related flows.
- Route, trip, and vehicle search.
- Vehicle lookup by registration/vehicle number.
- Booking creation, booking history, booking retrieval, cancellation, and ticket-related API routes.
- Payment creation and verification routes for the configured payment provider.
- Map-based route and vehicle visualization.
- Live vehicle tracking when the Socket.IO service is running and reachable.

### Transport Partner / Driver

- Multi-step onboarding: driver details, documents, bank details, location/admin selection, review, and completion.
- Partner application submission and application-related APIs.
- Partner profile and availability/status workflows.
- Vehicle assignment and trip workflow support.
- Browser geolocation can be used to send vehicle location to the socket server.
- Partner-facing trip, booking, and earnings views; actual values depend on connected APIs and database records.

### Administrator

- Admin dashboard and operational statistics.
- Partner application review and partner details.
- Vehicle listing, detail management, assignment, unassignment, and status operations.
- Route and location management.
- Schedule management.
- Revenue and vehicle-revenue views.
- Admin profile/settings and verification flows.
- Fleet, driver, alerts, and applications pages.

### Maps and Real-Time Features

- Leaflet / React Leaflet map components and OpenStreetMap tiles.
- Route geometry/polyline rendering where geometry is available.
- Source, destination, stop, and live-vehicle markers where supplied by the page.
- Socket.IO vehicle rooms and location broadcasts.
- Vehicle online-state updates on identity connection and offline handling on disconnect.
- Trip status relay to clients tracking a vehicle.

## Roles

| Role | Responsibilities |
|---|---|
| **User / Passenger** | Search trips and vehicles, manage bookings, view ticket-related information, and track vehicles. |
| **Partner / Driver** | Complete onboarding, manage availability, operate an assigned vehicle, and share vehicle location. |
| **Admin** | Review applications and manage partners, vehicles, routes, locations, schedules, and operational dashboards. |

Authentication is configured with NextAuth/Auth.js using credentials and Google providers. The credentials flow checks the relevant account collections and assigns a role to the authenticated account.

## Technology Stack

### Web app (`yatra/`)

- Next.js 16 App Router; React 19; TypeScript.
- Tailwind CSS 4.
- MongoDB and Mongoose.
- NextAuth/Auth.js v5 beta with credentials and Google providers; JWT-based sessions.
- Redux Toolkit and React Redux.
- Socket.IO client/server.
- Leaflet and React Leaflet.
- Recharts for dashboard charts.
- Cloudinary for upload integration.
- Nodemailer for email integration.
- Twilio for SMS/phone integration.
- Razorpay for payment integration.
- Axios for HTTP requests.

### Socket server (`socketServer/`)

- Node.js ES modules, Express, Socket.IO, Mongoose, dotenv, and CORS.

## Architecture

```text
┌──────────────────────────────┐
│ Browser                      │
│ Passenger / Partner / Admin  │
└──────────────┬───────────────┘
               │ HTTP(S)
               ▼
┌──────────────────────────────┐
│ Next.js application          │
│ Pages + App Router API routes│
└──────────────┬───────────────┘
               │
        ┌──────┴─────────┐
        ▼                ▼
┌───────────────┐  ┌────────────────────┐
│ MongoDB       │  │ Socket.IO server   │
│ via Mongoose  │  │ live event channel  │
└───────────────┘  └──────────┬─────────┘
                             ▼
                    Vehicle-room subscribers
                    and tracking maps
```

The web app owns the main UI and HTTP APIs. The Socket.IO server handles persistent client connections and broadcasts. Both services need correct database configuration and compatible model/collection expectations.

## Repository Structure

```text
YatraX/
├── yatra/                         # Next.js application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── app/                   # Pages and API route handlers
│   │   │   ├── admin/             # Admin pages
│   │   │   ├── partner/           # Partner onboarding/dashboard pages
│   │   │   ├── api/               # HTTP API handlers
│   │   │   ├── booking/           # Booking UI
│   │   │   ├── tracking/          # Tracking UI
│   │   │   └── ...                # Other pages
│   │   ├── components/            # Shared and feature UI
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Database, fare, and utility logic
│   │   ├── models/                # Mongoose models
│   │   ├── redux/                 # Redux store and slices
│   │   ├── schemas/               # Validation schemas
│   │   ├── types/                 # TypeScript types
│   │   └── utils/                 # Utilities
│   ├── .env.local                 # Local secrets; do not commit
│   ├── package.json
│   └── next.config.ts
├── socketServer/                  # Standalone Socket.IO service
│   ├── models/                    # Socket-server Mongoose models
│   ├── internal/                  # Internal server logic
│   ├── index.js                   # Express + Socket.IO entry point
│   ├── .env                       # Local secrets; do not commit
│   └── package.json
└── README.md
```

## Prerequisites

- A current Node.js LTS version compatible with the installed Next.js release, plus npm.
- A MongoDB database (local or hosted).
- Google OAuth credentials if Google sign-in is required.
- SMTP credentials for email workflows.
- Twilio credentials for phone/SMS workflows.
- Cloudinary credentials for Cloudinary-backed uploads.
- Razorpay keys for payment-flow testing.

Optional providers are only required for the features that use them. Never put real credentials in this README or in Git.

## Setup and Installation

### 1. Clone the repository

Replace the placeholder with the actual repository URL:

```bash
git clone <YOUR_REPOSITORY_URL>
cd YatraX
```

### 2. Install the web app dependencies

```bash
cd yatra
npm install
```

Create `yatra/.env.local` using the variable list below.

### 3. Install the socket server dependencies

Open a second terminal from the repository root:

```bash
cd socketServer
npm install
```

Create `socketServer/.env` using the variable list below.

## Environment Variables

### `yatra/.env.local`

```env
# Database
MONGODB_URL=

# Auth.js / NextAuth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# SMTP email
SMTP_EMAIL=
SMTP_PASS=
SMTP_HOST=
SMTP_PORT=

# Twilio SMS / phone verification
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Cloudinary uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# URL reachable by the browser
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:5000

# Trusted server-to-server trip-status relay
INTERNAL_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

### `socketServer/.env`

```env
PORT=5000
MONGODB_URL=
NEXT_BASE_URL=http://localhost:3000
INTERNAL_SECRET=
```

### Environment notes

- `MONGODB_URL` must point to the intended database. Configure Atlas network access and database-user permissions if using MongoDB Atlas.
- Use a strong private `AUTH_SECRET`.
- Google OAuth client credentials come from your Google OAuth configuration; configured callback URLs must match the app URL.
- SMTP, Twilio, Cloudinary, and Razorpay values are needed only for the associated integrations.
- `NEXT_PUBLIC_SOCKET_SERVER_URL` is exposed to the browser and must be reachable from the user's browser.
- `INTERNAL_SECRET` must match in both services. It must not be exposed with a `NEXT_PUBLIC_` prefix.
- Razorpay secret keys must remain server-side; only the public key should be browser-exposed.
- Use production URLs and HTTPS/WSS endpoints when deployed.
- Never commit `.env` or `.env.local` files.

## Run and Build

### Development

Terminal 1 — web application:

```bash
cd yatra
npm run dev
```

By default, Next.js serves the app at `http://localhost:3000`.

Terminal 2 — Socket.IO server:

```bash
cd socketServer
npm run dev
```

The socket server uses `PORT` or defaults to port `5000`. If your local setup uses port `4000`, keep `PORT` and `NEXT_PUBLIC_SOCKET_SERVER_URL` consistent.

### Production build and start

```bash
cd yatra
npm run build
npm run start
```

For the socket server, use `npm start` if your local `socketServer/package.json` defines that script. Otherwise run its entry point directly:

```bash
cd socketServer
node index.js
```

## Main Workflows

### Partner onboarding

```text
Partner starts onboarding
        ↓
Enters profile/driver details
        ↓
Uploads required documents
        ↓
Adds bank and location/admin details
        ↓
Reviews and submits application
        ↓
Admin reviews the application
        ↓
Application status is updated
```

### Vehicle and route assignment

```text
Admin selects vehicle, partner, and active route
        ↓
API validates account and assignment eligibility
        ↓
Vehicle and partner references/status are updated
        ↓
Changes are saved to MongoDB
```

A vehicle may not appear in trip search just because a vehicle document exists. Search eligibility may also depend on route assignment, schedule/trip records, date, status, online state, route stop order, and remaining seats.

### Trip search and booking

```text
Passenger chooses source, destination, and date
        ↓
Trip/route search
        ↓
Eligible trips and vehicles are returned
        ↓
Passenger selects an option
        ↓
Booking/payment flow (where configured)
        ↓
Booking history and ticket views
```

Exact eligibility and required parameters are defined by each API handler.

## Real-Time Tracking

The Socket.IO server creates an HTTP server, attaches Socket.IO, connects to MongoDB, and uses vehicle-specific rooms named `vehicle:<vehicleId>`.

### Events handled by the socket server

| Event | Direction | Purpose |
|---|---|---|
| `identity` | Client → server | Registers partner/socket identity and may associate a vehicle with the connection. |
| `join:vehicle` | Client → server | Subscribes to `vehicle:<vehicleId>`. |
| `leave:vehicle` | Client → server | Leaves the vehicle room. |
| `partner:location` | Partner client → server | Sends location and telemetry. |
| `location:update` | Server → room | Broadcasts location to vehicle-room subscribers. |
| `location:update:trip` | Server → room | Broadcasts location with a trip ID when available. |
| `trip:status` | Server → room | Broadcasts a trip status update. |

Location payload shape used by the server:

```json
{
  "vehicleId": "VEHICLE_ID",
  "latitude": 23.3441,
  "longitude": 85.3096,
  "speed": 25,
  "heading": 90
}
```

The IDs and coordinates are illustrative. Use actual vehicle IDs and numeric coordinates from the application.

### Internal trip-status endpoint

The socket server exposes `POST /internal/trip-status`. It expects the `x-internal-secret` header to match `INTERNAL_SECRET` and a JSON body containing `vehicleId`, `status`, and (when available) `tripId`.

```http
POST /internal/trip-status
Content-Type: application/json
x-internal-secret: <INTERNAL_SECRET>
```

```json
{
  "vehicleId": "VEHICLE_ID",
  "tripId": "TRIP_ID",
  "status": "running"
}
```

The server records running trips in its active-vehicle map and removes them for `completed` or `cancelled`. Keep this endpoint private to trusted server-to-server callers.

> Socket event names and payloads must match between the client and server. Client-supplied identity or vehicle IDs should not be treated as authorization on their own; validate identity and room access server-side before public production use.

## Fare Calculation

`yatra/src/lib/fare.ts` contains the current configurable fare table:

| Vehicle type | Base fare | Fare per km |
|---|---:|---:|
| Bike | ₹10 | ₹3 |
| Auto | ₹20 | ₹8 |
| Cab | ₹30 | ₹12 |
| Bus | ₹15 | ₹2 |

`calcFarePerPassenger(vehicleType, distanceKm)` calculates:

```text
fare = round(base fare + fare per km × distance in km)
```

`calcTotalFare(vehicleType, distanceKm, passengerCount)` multiplies the per-passenger fare by at least one passenger. These are project-configured values, not a guarantee of a final commercial pricing policy. Review `src/lib/fare.ts` before changing rates.

The `haversineKm` and `totalRouteDistanceKm` helpers calculate straight-line geographic distance. Straight-line distance may differ from actual road distance; describe it as road distance only if a road-routing service is used for that calculation.

## API Overview

This is a high-level endpoint index, **not a complete API contract**. Check the corresponding `route.ts` file for supported HTTP methods, query parameters, validation, response bodies, and authorization.

### Authentication and profile

| Endpoint | Purpose |
|---|---|
| `/api/auth/[...nextauth]` | Auth.js handlers. |
| `/api/auth/register` | Account registration. |
| `/api/auth/register-admin` | Admin registration. |
| `/api/auth/verify-email` | Email verification. |
| `/api/auth/verify-phone` | Phone verification. |
| `/api/auth/send-email-otp` | Send email OTP. |
| `/api/auth/send-phone-otp` | Send phone OTP. |
| `/api/user/me` | Current user information. |
| `/api/partner/me` | Current partner information. |
| `/api/admin/me` | Current admin information. |
| `/api/update-password` | Password update flow. |

### Partner and admin operations

| Endpoint | Purpose |
|---|---|
| `/api/partner/application` | Partner application operations. |
| `/api/partner/application/[id]` | Individual application operations. |
| `/api/partner/toggle-status` | Partner availability/status. |
| `/api/admin/applications` | Admin application listing/management. |
| `/api/admin/applications/[id]` | Individual application management. |
| `/api/admin/partner` | Admin partner management. |
| `/api/admin/partner/[partnerId]/details` | Partner details. |
| `/api/admin/vehicle` | Admin vehicle operations. |
| `/api/admin/vehicle/[vehicleId]` | Individual vehicle operations. |
| `/api/admin/vehicle/[vehicleId]/assign` | Assign vehicle to partner and route. |
| `/api/admin/vehicle/[vehicleId]/unassign` | Remove a vehicle assignment. |
| `/api/admin/vehicle/[vehicleId]/status` | Vehicle status operations. |
| `/api/admin/routes` | Route management. |
| `/api/admin/routes/[routeId]` | Individual route operations. |
| `/api/admin/location` | Location management. |
| `/api/admin/location/[locationId]` | Individual location operations. |
| `/api/admin/schedules` | Schedule management. |
| `/api/admin/schedules/[id]` | Individual schedule operations. |

### Search, trips, bookings, payments, and tracking

| Endpoint | Purpose |
|---|---|
| `/api/route/search` | Route search. |
| `/api/location/search` | Location search. |
| `/api/trip/search` | Trip search. |
| `/api/trip/mine` | Trips associated with the current account, subject to authorization. |
| `/api/trip/[tripId]/start` | Start-trip operation. |
| `/api/trip/[tripId]/complete` | Complete-trip operation. |
| `/api/trip/[tripId]/complete-and-reverse` | Complete/reverse trip workflow. |
| `/api/corn/generate-trips` | Trip-generation endpoint; verify intended invocation and access protection before use. |
| `/api/vehicle/search` | Vehicle search. |
| `/api/vehicle/search-by-number` | Search by vehicle number. |
| `/api/vehicle/[vehicleId]` | Vehicle detail endpoint. |
| `/api/track/getlocation/[vehicleId]` | Retrieve vehicle location. |
| `/api/bookings` | Booking collection operations. |
| `/api/bookings/create` | Create booking. |
| `/api/bookings/my` | Current user's bookings. |
| `/api/bookings/history` | Booking history. |
| `/api/bookings/[bookingId]` | Individual booking operations. |
| `/api/bookings/[bookingId]/cancel` | Cancel a booking. |
| `/api/bookings/[bookingId]/ticket` | Ticket-related operation. |
| `/api/payment/create` | Create payment. |
| `/api/payment/verify` | Verify payment. |
| `/api/notifications` | Notifications. |
| `/api/notifications/mark-read` | Mark notifications read. |
| `/api/contact` | Contact form endpoint. |

Replace dynamic segments such as `[vehicleId]`, `[tripId]`, and `[bookingId]` with actual record IDs. Do not assume an endpoint uses a particular HTTP method without checking its route handler.

## Data Models

The authoritative schema is defined in `yatra/src/models/` and `socketServer/models/`. Main domain entities include:

- **User** — passenger account and profile data.
- **Admin** — administrator and organization/operational data.
- **Partner** — driver/partner profile, verification, availability, and assignment references.
- **Vehicle** — vehicle details, type, status, route/partner references, and location telemetry.
- **Route** — source/destination/stop data, geometry, distance/duration, active state, and fare-related fields where defined.
- **Location** — named geographic location, city/state, and coordinates.
- **Trip** — individual trip, vehicle, schedule/route relationships, and status.
- **TripSchedule** — planned/scheduled trip information.
- **Booking** — passenger booking and trip/seat-related information.
- Other models may support applications, notifications, or related workflows; inspect the models directory for the full authoritative list.

**Filename casing matters.** If the file is named `Route.models.ts`, imports must use `Route.models` with the capital `R`, especially for Linux deployments.

## Security Checklist

Before deploying publicly, review these items:

- Never commit `.env`, `.env.local`, OAuth credentials, database passwords, SMTP/Twilio credentials, Cloudinary secrets, payment secrets, or `INTERNAL_SECRET`.
- Use a least-privilege MongoDB user and restrict database network access.
- Use HTTPS for the app and WSS for production sockets.
- Restrict Socket.IO CORS to the real frontend origin.
- Validate authentication and authorization for sensitive API operations.
- Verify ownership/permissions for vehicle, partner, route, trip, and booking IDs server-side.
- Keep internal endpoints private and protect them with strong service authentication.
- Do not trust client-supplied partner IDs, vehicle IDs, or roles without server validation.
- Add rate limiting to sign-in, OTP, contact, and upload endpoints.
- Validate file types and sizes and restrict access to identity documents.
- Verify payment signatures server-side before recording successful payments.
- Avoid logging passwords, OTPs, identity documents, or other sensitive personal data.
- Review dependency audit output and apply dependency updates deliberately.

This is a recommended deployment checklist, not a claim that every control is already implemented.

## Troubleshooting

### Build: `Module not found` for `Route.models`

Check the filename under `src/models/` and match its capitalization in all imports. Windows can hide case mismatches that fail on Linux.

### Build: merge conflict marker encountered

Search the source for `<<<<<<<`, `=======`, and `>>>>>>>`. Resolve the entire conflict block, save the file, and rerun `npm run build`.

### MongoDB connection failure

Check `MONGODB_URL`, credentials, network access, and Atlas IP allow-list. Verify that the web app and socket server are pointed at the intended database.

### Socket connection failure

Confirm the socket process is running, the port is correct, `NEXT_PUBLIC_SOCKET_SERVER_URL` is reachable from the browser, and `NEXT_BASE_URL` matches the frontend origin. Check browser and server logs.

### Live location does not update

Check geolocation permission, HTTPS/localhost requirements, the `identity` and `partner:location` payloads, vehicle room subscription, matching frontend event names, vehicle ID, and MongoDB update errors.

### Trip search returns no vehicles

Inspect source/destination matching, route stop order, date, schedule/trip records, trip status, vehicle-route assignment, vehicle availability/online state, and remaining seats. A vehicle document by itself may not meet all search conditions.

### OAuth sign-in fails

Verify Google OAuth redirect URIs, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, and the configured application URL.

### Email/SMS verification fails

Check SMTP settings and sender configuration, or Twilio credentials and sender number. Never share OTPs or provider secrets in logs.

### Payment flow fails

Ensure Razorpay keys are from the same test/live environment and payment verification is performed server-side.

### Port already in use

Stop the process already using the configured port or select a different port and update related URLs consistently.

## Deployment

The web application and Socket.IO server are separate services. Deploy both if live tracking is required.

### Next.js app

1. Configure production environment variables in the hosting provider.
2. Install dependencies from the lockfile (for example, `npm ci` in CI).
3. Run `npm run build`.
4. Start with `npm run start` on a compatible host or use the provider's supported Next.js integration.
5. Set production socket URL, OAuth callback URLs, payment configuration, and database access rules.

### Socket.IO service

1. Deploy `socketServer/` as a persistent Node.js service with WebSocket support.
2. Set `PORT`, `MONGODB_URL`, `NEXT_BASE_URL`, and `INTERNAL_SECRET`.
3. Set `NEXT_PUBLIC_SOCKET_SERVER_URL` in the web app to the deployed socket URL.
4. Restrict CORS to the production web origin.
5. Confirm the host supports persistent WebSocket connections and that both services can reach the intended database.

Test payment, email, SMS, document upload, and tracking flows end-to-end before production use.

## Future Improvements

Potential next steps include:

- Stronger socket authentication and room authorization.
- Automated unit, integration, and end-to-end tests.
- API contracts and generated API documentation.
- Monitoring, structured logs, and health checks for each service.
- Road-network-based distance and ETA calculation.
- Better trip-search diagnostics and operational reporting.
- Push notifications and optional PWA support.
- Route optimization and traffic-aware ETA estimation.
- Accessibility and performance audits for all dashboards.

These are suggestions, not claims that the features are already implemented.

## Contributors

- **Bipin Kumar**
- **Lavkush Bairwa**

## License

No license was specified in the earlier README. Add a `LICENSE` file and update this section before distributing or reusing the project. Until a license is added, do not assume the repository grants an open-source license.

---

<p align="center">
  <strong>YatraX</strong><br/>
  Smart transport management, trip discovery, and real-time vehicle tracking.
</p>
