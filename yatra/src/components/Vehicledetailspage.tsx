"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import AssignDriverModal from './Assigndrivermodal';
import {
    ArrowLeft,
    Bike,
    Bus,
    Car,
    ExternalLink,
    FileText,
    Gauge,
    MapPin,
    Navigation2,
    Truck,
    User,
    Wifi,
    WifiOff,
} from "lucide-react";

// ---------- types (matches the actual API response shape) ----------

type VehicleType = "bike" | "auto" | "cab" | "bus";
type VehicleStatus = "available" | "assigned" | "maintenance";
type TripStatus = "idle" | "boarding" | "running" | "completed";

interface DocFile {
    url: string;
    publicId?: string;
    name?: string;
}

interface Partner {
    name: string;
    phone: string;
    averageRating: number;
    totalRides?: number;
    completedRides?: number;
    cancelledRides?: number;
    profilePhoto?: DocFile | string;
    currentLatitude?: number | null;
    currentLongitude?: number | null;
    isOnline: boolean;
    isAvailable?: boolean;
}

interface RouteLocation {
    name: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

interface VehicleRoute {
    distanceInKm?: number;
    estimatedDurationInMinutes?: number;
    locations?: RouteLocation[];
}

interface Vehicle {
    _id: string;
    vehicleType: VehicleType;
    brand?: string;
    model?: string;
    vehicleNumber: string;
    seatingCapacity: number;
    availableSeats: number;
    status: VehicleStatus;
    tripStatus: TripStatus;
    assignedPartnerId?: Partner | null;
    routeId?: VehicleRoute | null;
    createdAt: string;
    updatedAt: string;
}

interface VehicleDetailsResponse {
    vehicle: Vehicle;
    assignment: {
        isAssigned: boolean;
        assignedAt: string | null;
        partner: Partner | null;
    };
    trip: {
        status: TripStatus;
        scheduledStartAt: string | null;
        scheduledEndAt: string | null;
    };
    tracking: {
        isOnline: boolean;
        latitude: number | null;
        longitude: number | null;
        speed: number;
        heading: number;
        lastLocationUpdate: string | null;
    };
    capacity: {
        availableSeats: number;
    };
    routeSummary: {
        totalStops: number;
        distance?: number;
        estimatedDuration?: number;
    } | null;
    documents?: {
        rc?: DocFile;
        insurance?: DocFile;
        pollution?: DocFile;
    };
}

const TYPE_ICON: Record<VehicleType, typeof Bus> = {
    bus: Bus,
    cab: Car,
    auto: Truck,
    bike: Bike,
};

const STATUS_STYLE: Record<VehicleStatus, string> = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    assigned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    maintenance: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const DOC_LABELS: { key: "rc" | "insurance" | "pollution"; label: string }[] = [
    { key: "rc", label: "Registration Certificate" },
    { key: "insurance", label: "Insurance" },
    { key: "pollution", label: "Pollution Certificate" },
];

export default function VehicleDetailsPage({ vehicleId }: { vehicleId: string }) {
    const router = useRouter();
    const [data, setData] = useState<VehicleDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAssign, setShowAssign] = useState(false);

    // single reusable fetcher - used on mount AND after assigning a driver
    async function reload() {
        const res = await fetch(`/api/admin/vehicle/${vehicleId}`);
        const json = await res.json();
        if (res.ok && json.success) setData(json);
    }

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/admin/partner/${vehicleId}`);
                const json = await res.json();

                if (!res.ok || !json.success) {
                    throw new Error(json?.message || "Could not load vehicle");
                }

                if (!cancelled) setData(json);
            } catch (err: any) {
                if (!cancelled) setError(err?.message || "Something went wrong");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [vehicleId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-red-400">{error || "Vehicle not found"}</p>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-400 hover:text-white"
                >
                    &larr; Go back
                </button>
            </div>
        );
    }

    const { vehicle, assignment, trip, tracking, capacity, routeSummary, documents } = data;
    const TypeIcon = TYPE_ICON[vehicle.vehicleType];

    return (
        <div className="min-h-screen bg-[#070a12] px-6 py-6 text-white">
            {/* header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="font-mono text-lg tracking-wide">
                                {vehicle.vehicleNumber}
                            </h1>
                            <p className="text-sm text-gray-400 capitalize">
                                {vehicle.brand} {vehicle.model} &middot; {vehicle.vehicleType}
                            </p>
                        </div>
                    </div>
                </div>

                <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLE[vehicle.status]}`}
                >
                    {vehicle.status}
                </span>
            </div>

            {/* content grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* vehicle info */}
                <Card title="Vehicle Information" delay={0}>
                    <InfoRow label="Type" value={vehicle.vehicleType} capitalize />
                    <InfoRow label="Brand" value={vehicle.brand || "—"} />
                    <InfoRow label="Model" value={vehicle.model || "—"} />
                    <InfoRow
                        label="Seating Capacity"
                        value={`${vehicle.seatingCapacity} seats`}
                    />
                    <InfoRow
                        label="Registered"
                        value={new Date(vehicle.createdAt).toLocaleDateString()}
                    />
                </Card>

                {/* assignment */}
                <Card title="Assignment & Trip" delay={0.05}>
                    <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                        <User className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                            <p className="text-sm text-white">
                                {assignment.partner?.name || "Not Assigned"}
                            </p>
                            {assignment.partner ? (
                                <p className="text-xs text-gray-500">
                                    {assignment.partner.phone} &middot; ★{" "}
                                    {assignment.partner.averageRating?.toFixed(1) ?? "—"}
                                    {assignment.partner.completedRides != null &&
                                        ` · ${assignment.partner.completedRides} rides`}
                                </p>
                            ) : (
                                <button
                                    onClick={() => setShowAssign(true)}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    + Assign Driver
                                </button>
                            )}
                        </div>
                        {assignment.partner && (
                            <span
                                className={`h-2 w-2 rounded-full ${assignment.partner.isOnline
                                    ? "bg-emerald-400"
                                    : "bg-gray-600"
                                    }`}
                            />
                        )}
                    </div>

                    <InfoRow
                        label="Assigned At"
                        value={
                            assignment.assignedAt
                                ? new Date(assignment.assignedAt).toLocaleString()
                                : "—"
                        }
                    />
                    <InfoRow
                        label="Route Stops"
                        value={routeSummary ? `${routeSummary.totalStops} stops` : "No Route"}
                    />
                    <InfoRow
                        label="Route Distance"
                        value={routeSummary?.distance ? `${routeSummary.distance} km` : "—"}
                    />
                    <InfoRow label="Trip Status" value={trip.status} capitalize />
                    <InfoRow
                        label="Scheduled Start"
                        value={
                            trip.scheduledStartAt
                                ? new Date(trip.scheduledStartAt).toLocaleString()
                                : "—"
                        }
                    />
                    <InfoRow
                        label="Scheduled End"
                        value={
                            trip.scheduledEndAt
                                ? new Date(trip.scheduledEndAt).toLocaleString()
                                : "—"
                        }
                    />
                </Card>

                {/* live status */}
                <Card title="Live Status" delay={0.1}>
                    <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                        {tracking.isOnline ? (
                            <Wifi className="h-4 w-4 text-emerald-400" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-gray-500" />
                        )}
                        <p className="text-sm">
                            {tracking.isOnline ? "Online" : "Offline"}
                        </p>
                    </div>

                    <InfoRow
                        label="Location"
                        value={
                            tracking.latitude && tracking.longitude
                                ? `${tracking.latitude.toFixed(4)}, ${tracking.longitude.toFixed(4)}`
                                : "No signal"
                        }
                        icon={MapPin}
                    />
                    <InfoRow
                        label="Speed"
                        value={`${tracking.speed ?? 0} km/h`}
                        icon={Gauge}
                    />
                    <InfoRow
                        label="Heading"
                        value={`${tracking.heading ?? 0}°`}
                        icon={Navigation2}
                    />
                    <InfoRow
                        label="Available Seats"
                        value={`${capacity.availableSeats} / ${vehicle.seatingCapacity}`}
                    />
                    <InfoRow
                        label="Last Update"
                        value={
                            tracking.lastLocationUpdate
                                ? new Date(tracking.lastLocationUpdate).toLocaleString()
                                : "—"
                        }
                    />
                </Card>
            </div>

            {/* documents */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
                <h2 className="mb-4 text-sm font-medium text-gray-300">Documents</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {DOC_LABELS.map(({ key, label }) => {
                        const doc = documents?.[key];
                        return (
                            <a
                                key={key}
                                href={doc?.url || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-colors ${doc ? "hover:border-blue-500/40" : "cursor-default opacity-50"
                                    }`}
                                onClick={(e) => {
                                    if (!doc) e.preventDefault();
                                }}
                            >
                                <div className="flex h-28 items-center justify-center bg-black/20">
                                    {doc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={doc.url}
                                            alt={label}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                // non-image (e.g. pdf) - fall back to icon
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <FileText className="h-6 w-6 text-gray-600" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between px-3 py-2.5">
                                    <div>
                                        <p className="text-xs font-medium text-gray-200">
                                            {label}
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                            {doc ? "Uploaded" : "Not uploaded"}
                                        </p>
                                    </div>
                                    {doc && (
                                        <ExternalLink className="h-3.5 w-3.5 text-gray-500 group-hover:text-blue-400" />
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            </motion.div>

            {/* assign driver modal */}
            <AssignDriverModal
                vehicleId={vehicleId}
                open={showAssign}
                onClose={() => setShowAssign(false)}
                onSuccess={reload}
            />
        </div>
    );
}

// ---------- small primitives ----------

function Card({
    title,
    delay,
    children,
}: {
    title: string;
    delay: number;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
        >
            <h2 className="mb-4 text-sm font-medium text-gray-300">{title}</h2>
            <div className="space-y-2.5">{children}</div>
        </motion.div>
    );
}

function InfoRow({
    label,
    value,
    capitalize,
    icon: Icon,
}: {
    label: string;
    value: string;
    capitalize?: boolean;
    icon?: typeof MapPin;
}) {
    return (
        <div className="flex items-center justify-between border-b border-white/5 py-1.5 last:border-0">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
            </span>
            <span className={`text-sm text-gray-200 ${capitalize ? "capitalize" : ""}`}>
                {value}
            </span>
        </div>
    );
}