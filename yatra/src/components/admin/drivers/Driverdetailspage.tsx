"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    BadgeCheck,
    Car,
    ExternalLink,
    FileText,
    Phone,
    Star,
    Wifi,
    WifiOff,
} from "lucide-react";

// ---------- types (matches the actual API response shape) ----------

interface DocFile {
    url: string;
    fileId?: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
}

type ApplicationStatus = "pending" | "approved" | "rejected";

interface AssignedVehicle {
    _id: string;
    vehicleType: string;
    brand?: string;
    model?: string;
    vehicleNumber: string;
    status: string;
}

interface Partner {
    id: string;
    name: string;
    phone: string;
    dlNumber: string;
    experience: number;
    aadharNumber?: string;
    applicationStatus: ApplicationStatus;
    isOnline: boolean;
    isAvailable: boolean;
    isVerified: boolean;
    totalRides: number;
    completedRides: number;
    cancelledRides: number;
    averageRating: number;
    profilePhoto?: DocFile;
    assignedVehicleId?: AssignedVehicle | null;
    documents?: {
        aadharFront?: DocFile;
        aadharBack?: DocFile;
        drivingLicense?: DocFile;
        profilePhoto?: DocFile;
    };
    createdAt: string;
}

const STATUS_STYLE: Record<ApplicationStatus, string> = {
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const DOC_LABELS: {
    key: "aadharFront" | "aadharBack" | "drivingLicense" | "profilePhoto";
    label: string;
}[] = [
    { key: "profilePhoto", label: "Profile Photo" },
    { key: "drivingLicense", label: "Driving License" },
    { key: "aadharFront", label: "Aadhaar (Front)" },
    { key: "aadharBack", label: "Aadhaar (Back)" },
];

export default function DriverDetailsPage({ partnerId }: { partnerId: string }) {
    const router = useRouter();
    const [partner, setPartner] = useState<Partner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/admin/partner/${partnerId}/details`);
                const json = await res.json();

                console.log("Partner details response:", json);

                if (!res.ok || !json.success) {
                    throw new Error(json?.message || "Could not load partner");
                }

                if (!cancelled) setPartner(json.partner);
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
    }, [partnerId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    if (error || !partner) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-red-400">{error || "Partner not found"}</p>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-400 hover:text-white"
                >
                    &larr; Go back
                </button>
            </div>
        );
    }

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
                        <div className="h-11 w-11 overflow-hidden rounded-xl bg-blue-500/10">
                            {partner.profilePhoto?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={partner.profilePhoto.url}
                                    alt={partner.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-blue-400 text-sm font-medium">
                                    {partner.name?.[0]?.toUpperCase() ?? "?"}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-lg">{partner.name}</h1>
                                {partner.isVerified && (
                                    <BadgeCheck className="h-4 w-4 text-blue-400" />
                                )}
                            </div>
                            <p className="flex items-center gap-1 text-sm text-gray-400">
                                <Phone className="h-3 w-3" />
                                {partner.phone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLE[partner.applicationStatus]}`}
                    >
                        {partner.applicationStatus}
                    </span>
                    <span
                        className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                            partner.isOnline
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : "border-white/10 bg-white/[0.03] text-gray-400"
                        }`}
                    >
                        {partner.isOnline ? (
                            <Wifi className="h-3 w-3" />
                        ) : (
                            <WifiOff className="h-3 w-3" />
                        )}
                        {partner.isOnline ? "On Duty" : "Off Duty"}
                    </span>
                </div>
            </div>

            {/* content grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* driver info */}
                <Card title="Driver Information" delay={0}>
                    <InfoRow label="DL Number" value={partner.dlNumber} />
                    <InfoRow label="Experience" value={`${partner.experience} years`} />
                    <InfoRow
                        label="Aadhaar Number"
                        value={partner.aadharNumber || "—"}
                    />
                    <InfoRow
                        label="Available for Trips"
                        value={partner.isAvailable ? "Yes" : "No"}
                    />
                    <InfoRow
                        label="Joined"
                        value={new Date(partner.createdAt).toLocaleDateString()}
                    />
                </Card>

                {/* performance */}
                <Card title="Performance" delay={0.05}>
                    <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                        <Star className="h-4 w-4 text-amber-400" />
                        <p className="text-sm">
                            {partner.averageRating?.toFixed(1) ?? "—"} average rating
                        </p>
                    </div>
                    <InfoRow label="Total Rides" value={`${partner.totalRides ?? 0}`} />
                    <InfoRow
                        label="Completed Rides"
                        value={`${partner.completedRides ?? 0}`}
                    />
                    <InfoRow
                        label="Cancelled Rides"
                        value={`${partner.cancelledRides ?? 0}`}
                    />
                    <InfoRow
                        label="Completion Rate"
                        value={
                            partner.totalRides
                                ? `${Math.round((partner.completedRides / partner.totalRides) * 100)}%`
                                : "—"
                        }
                    />
                </Card>

                {/* assigned vehicle */}
                <Card title="Assigned Vehicle" delay={0.1}>
                    {partner.assignedVehicleId ? (
                        <>
                            <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                                <Car className="h-4 w-4 text-blue-400" />
                                <div>
                                    <p className="font-mono text-sm">
                                        {partner.assignedVehicleId.vehicleNumber}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {partner.assignedVehicleId.brand}{" "}
                                        {partner.assignedVehicleId.model} &middot;{" "}
                                        {partner.assignedVehicleId.vehicleType}
                                    </p>
                                </div>
                            </div>
                            <InfoRow
                                label="Vehicle Status"
                                value={partner.assignedVehicleId.status}
                                capitalize
                            />
                        </>
                    ) : (
                        <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-500">
                            No vehicle assigned
                        </p>
                    )}
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {DOC_LABELS.map(({ key, label }) => {
                        const doc = partner.documents?.[key];
                        return (
                            <a
                                key={key}
                                href={doc?.url || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-colors ${
                                    doc ? "hover:border-blue-500/40" : "cursor-default opacity-50"
                                }`}
                                onClick={(e) => {
                                    if (!doc) e.preventDefault();
                                }}
                            >
                                <div className="flex h-24 items-center justify-center bg-black/20">
                                    {doc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={doc.url}
                                            alt={label}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <FileText className="h-6 w-6 text-gray-600" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between px-3 py-2">
                                    <p className="text-xs font-medium text-gray-200">{label}</p>
                                    {doc && (
                                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-500 group-hover:text-blue-400" />
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}

// ---------- small primitives (identical to VehicleDetailsPage's) ----------

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
}: {
    label: string;
    value: string;
    capitalize?: boolean;
}) {
    return (
        <div className="flex items-center justify-between border-b border-white/5 py-1.5 last:border-0">
            <span className="text-xs text-gray-500">{label}</span>
            <span className={`text-sm text-gray-200 ${capitalize ? "capitalize" : ""}`}>
                {value}
            </span>
        </div>
    );
}