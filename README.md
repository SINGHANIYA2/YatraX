# 🚌 YatraX - Smart Transport Management, Booking & Live Vehicle Tracking Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socketdotio"/>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css"/>
</p>

<p align="center">
A scalable, real-time transportation management platform for vehicle tracking, route management, partner onboarding, and booking services.
</p>

---

# 📖 Overview

**YatraX** is a full-stack transportation management platform built to digitize and streamline public and private transport operations. The platform enables administrators to manage vehicles, drivers, routes, and bookings while allowing users to search and track vehicles in real time.

The system consists of:

* 👤 User Portal
* 🚖 Partner (Driver) Portal
* 🛠️ Admin Dashboard
* 🗺️ Live Vehicle Tracking System
* 🛣️ Route Management System
* 📋 Partner Verification System
* 🔐 Authentication & Authorization System
* 🔌 Real-Time Communication using Socket.IO

---

# 🌟 Core Modules

* Authentication & Authorization
* User Management System
* Partner Onboarding System
* Admin Management System
* Vehicle Management System
* Route Management System
* Location Management System
* Booking System
* Document Verification System
* Live Vehicle Tracking System
* Real-Time Socket Communication System
* Map & Navigation System

---

# ✨ Features

# 👤 User Features

### Authentication

* Email & Password Authentication
* Google Authentication
* Secure JWT Sessions
* Protected Routes

### Search & Tracking

* Search vehicles by:

  * Source & Destination
  * Vehicle Number
* Search through intermediate stops
* Live vehicle tracking
* Real-time location updates
* Route visualization on maps
* Estimated Arrival Time (ETA)

### Booking System

* Search available vehicles
* Seat Selection UI
* Booking Summary
* Responsive Booking Interface
* Upcoming Ticket Booking Support

---

# 🚖 Partner Features

## Partner Onboarding

* Multi-step registration flow
* Driver details verification
* Location & Admin selection
* Document verification
* Bank details verification
* Application review system

## Documents

* Profile Photo Upload
* Aadhaar Front Upload
* Aadhaar Back Upload
* Driving License Upload
* Cloudinary Integration

## Partner Dashboard

* Online/Offline Status
* Vehicle Assignment
* Current Route Details
* Live Location Sharing
* Real-time Socket Updates
* Trip Status Management
* Earnings & Statistics

---

# 🛠️ Admin Features

## Dashboard

* Total Vehicles
* Total Partners
* Active Vehicles
* Active Partners
* Total Trips
* Total Earnings
* Pending Applications
* Analytics Dashboard

## Partner Management

* View Applications
* Approve Partners
* Reject Partners
* Suspend Partners
* View Uploaded Documents
* Manage Partner Status

## Vehicle Management

* Add Vehicles
* Update Vehicle Details
* Assign Vehicles to Partners
* Remove Assignments
* Maintenance Management
* Real-Time Tracking

## Route Management

* Create Routes
* Add Intermediate Stops
* Update Routes
* Activate/Deactivate Routes
* Route Geometry Management
* Distance & Duration Management

## Location Management

* Add Locations
* Search Locations
* Activate/Deactivate Locations
* Assign Locations to Admins

---

# ⚡ Real-Time Features

* Socket.IO Server
* Live Vehicle Tracking
* Real-time Vehicle Status
* Real-time Location Updates
* Driver Presence Detection
* Vehicle Room Subscription
* Automatic Map Updates
* Online/Offline Vehicle Detection

---

# 🔐 Security Features

* Role Based Access Control
* Middleware Authorization
* Protected Routes
* JWT Session Management
* Password Hashing using bcrypt
* Secure File Uploads
* Cloudinary Secure URLs
* Session Persistence
* Server-side Authentication

---

# 🗺️ Mapping Features

* React Leaflet Integration
* OpenStreetMap
* Route Polyline Rendering
* Source Marker
* Destination Marker
* Intermediate Stop Markers
* Live Vehicle Marker
* Auto Fit Bounds
* Dynamic Route Rendering
* Vehicle Position Updates

---

# 📤 File Upload System

* Cloudinary Integration
* Multi-file Upload
* Profile Photo Upload
* Aadhaar Upload
* Driving License Upload
* Secure File URLs
* Temporary Document Handling

---

# 📊 Analytics & Statistics

## Admin Dashboard

* Total Vehicles
* Total Partners
* Active Partners
* Active Vehicles
* Total Trips
* Total Earnings
* Pending Requests

## Partner Dashboard

* Total Trips
* Earnings
* Assigned Vehicle
* Availability Status

---

# 🏗️ System Architecture

```text
User
 │
 ▼
Frontend (Next.js)
 │
 ▼
API Routes
 │
 ├── MongoDB
 │
 └── Socket.IO Server
```

---

# 📂 Project Structure

```text
YatraX
│
├── socketServer
│   ├── models
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── node_modules
│
├── yatra
│   ├── src
│   │   ├── app
│   │   │   ├── admin
│   │   │   ├── partner
│   │   │   ├── booking
│   │   │   ├── tracking
│   │   │   ├── api
│   │   │   └── auth
│   │   │
│   │   ├── components
│   │   ├── hooks
│   │   ├── lib
│   │   ├── models
│   │   ├── redux
│   │   ├── schemas
│   │   ├── types
│   │   └── utils
│
│   ├── public
│   ├── package.json
│   └── next.config.ts
```

---

# 🗄️ Database Models

## User

```text
User
├── Name
├── Email
├── Password
├── Mobile Number
├── Role
├── Partner Status
└── Partner Application
```

---

## Admin

```text
Admin
├── Personal Details
├── Locations
├── Vehicles
├── Pending Requests
├── Approved Partners
├── Statistics
└── Bank Details
```

---

## Partner

```text
Partner
├── Personal Information
├── Documents
├── Assigned Vehicle
├── Bank Details
├── Statistics
└── Verification Status
```

---

## Vehicle

```text
Vehicle
├── Admin
├── Assigned Partner
├── Route
├── Vehicle Number
├── Vehicle Type
├── Live Location
├── Speed
├── Heading
├── Status
├── Trip Status
└── Online Status
```

---

## Route

```text
Route
├── Source
├── Destination
├── Intermediate Stops
├── Geometry
├── Distance
└── Duration
```

---

## Location

```text
Location
├── Name
├── City
├── State
├── Latitude
├── Longitude
└── Status
```

---

# 🗺️ Live Tracking System

## Search Flow

```text
Source + Destination
          │
          ▼
     Route Search
          │
          ▼
     Matching Routes
          │
          ▼
     Vehicle Search
          │
          ▼
   Available Vehicles
          │
          ▼
      Live Tracking
```

---

## Real-Time Flow

```text
Partner Device
      │
      ▼
Browser Geolocation
      │
      ▼
Socket.IO Server
      │
      ▼
MongoDB Update
      │
      ▼
Broadcast Location
      │
      ▼
User Tracking Page
      │
      ▼
Live Map Update
```

---

# 🔌 Socket Events

## Driver Online

```javascript
socket.emit("partner:online", partnerId);
```

## Update Vehicle Location

```javascript
socket.emit("location:update", {
  vehicleId,
  latitude,
  longitude,
  speed,
  heading,
});
```

## Join Vehicle Room

```javascript
socket.emit("join:vehicle", vehicleId);
```

## Leave Vehicle Room

```javascript
socket.emit("leave:vehicle", vehicleId);
```

## Receive Location Updates

```javascript
socket.on("location:update");
```

---

# 📡 APIs

## Authentication

```http
POST /api/auth/signup
POST /api/auth/signin
```

## User

```http
GET /api/user/me
```

## Admin

```http
GET /api/admin/me
```

## Partner

```http
GET /api/partner/me
```

## Partner Applications

```http
POST /api/partner/application
GET /api/partner/application
PUT /api/partner/application
```

## Route APIs

```http
GET /api/route/search
GET /api/route/:id
POST /api/route
PUT /api/route/:id
```

## Vehicle APIs

```http
POST /api/vehicle/search
GET /api/vehicle/:id
POST /api/vehicle
PUT /api/vehicle/:id
```

## Tracking APIs

```http
GET /api/track/getlocation/:vehicleId
```

---

# ⚙️ Environment Variables

```env
MONGODB_URL=

AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

NEXTAUTH_URL=

NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:4000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


```

---

# 🖥️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/YatraX.git
cd YatraX
```

## Frontend

```bash
cd yatra
npm install
npm run dev
```

## Socket Server

```bash
cd socketServer
npm install
npm run dev
```

---

# 🚀 Future Enhancements

* Ticket Booking System
* Payment Gateway Integration
* Push Notifications
* Driver Mobile Application
* Route Optimization
* ETA Prediction using Machine Learning
* Geo-Fencing
* Admin Reports
* AI Traffic Prediction
* Multi-City Support
* Analytics Dashboard
* PWA Support
* QR Ticket Verification

---

# 🎯 Key Highlights

✅ Multi-role Authentication System
✅ User, Admin & Partner Dashboards
✅ Real-time Vehicle Tracking using Socket.IO
✅ Route Management System
✅ Partner Onboarding Workflow
✅ Document Verification System
✅ Cloudinary Integration
✅ Search through Intermediate Stops
✅ Live Map Rendering using Leaflet
✅ Scalable Transport Management Architecture

---

# 👨‍💻 Authors

### Bipin Kumar
### Lavkush Bairwa


---

# ⭐ YatraX

> Smart, scalable and real-time transportation management platform with live vehicle tracking, route management, partner onboarding and booking services.
