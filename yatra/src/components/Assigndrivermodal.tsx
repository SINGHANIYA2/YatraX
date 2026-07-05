"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MapPin, Star, User, X } from "lucide-react";

interface Partner {
    _id: string;
    name: string;
    phone: string;
    averageRating: number;
    isOnline: boolean;
}

interface RouteLocation {
    _id: string;
    name: string;
    city?: string;
}

interface RouteOption {
    _id: string;
    locations: RouteLocation[];
    distanceInKm?: number;
    estimatedDurationInMinutes?: number;
}

export default function AssignDriverModal({
    vehicleId,
    open,
    onClose,
    onSuccess,
}: {
    vehicleId: string;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [routes, setRoutes] = useState<RouteOption[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [partnerId, setPartnerId] = useState("");
    const [routeId, setRouteId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;

        async function loadOptions() {
            setLoadingOptions(true);
            setError(null);
            try {
                const [partnersRes, routesRes] = await Promise.all([
                    fetch("/api/admin/partner?availableOnly=true"),
                    fetch("/api/admin/routes?activeOnly=true"),
                ]);

                const partnersData = await partnersRes.json();
                const routesData = await routesRes.json();

                if (!partnersRes.ok || !partnersData.success) {
                    throw new Error(partnersData?.message || "Could not load drivers");
                }
                if (!routesRes.ok || !routesData.success) {
                    throw new Error(routesData?.message || "Could not load routes");
                }

                if (!cancelled) {
                    setPartners(partnersData.partners);
                    setRoutes(routesData.routes);
                }
            } catch (err: any) {
                if (!cancelled) setError(err?.message || "Something went wrong");
            } finally {
                if (!cancelled) setLoadingOptions(false);
            }
        }

        loadOptions();
        return () => {
            cancelled = true;
        };
    }, [open]);

    async function handleAssign() {
        if (!partnerId || !routeId) {
            setError("Select both a driver and a route");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/vehicle/${vehicleId}/assign`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ partnerId, routeId }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data?.message || "Could not assign driver");
            }

            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#0b1220] p-5 text-white"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>

                <h2 className="text-base font-medium">Assign Driver</h2>
                <p className="mt-1 text-sm text-gray-400">
                    Pick an available driver and an active route for this vehicle.
                </p>

                {loadingOptions ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        {/* driver picker */}
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Driver
                            </p>
                            {partners.length === 0 ? (
                                <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-500">
                                    No available drivers right now.
                                </p>
                            ) : (
                                <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                                    {partners.map((p , index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setPartnerId(p._id)}
                                            className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                                                partnerId === p._id
                                                    ? "border-blue-500 bg-blue-500/10"
                                                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                                            }`}
                                        >
                                            <User className="h-4 w-4 text-gray-500" />
                                            <div className="flex-1">
                                                <p className="text-sm">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.phone}</p>
                                            </div>
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <Star className="h-3 w-3" />
                                                {p.averageRating?.toFixed(1) ?? "—"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* route picker */}
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Route
                            </p>
                            {routes.length === 0 ? (
                                <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-500">
                                    No active routes available.
                                </p>
                            ) : (
                                <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                                    {routes.map((r) => (
                                        <button
                                            key={r._id}
                                            type="button"
                                            onClick={() => setRouteId(r._id)}
                                            className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                                                routeId === r._id
                                                    ? "border-blue-500 bg-blue-500/10"
                                                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                                            }`}
                                        >
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    {r.locations.map((l) => l.name).join(" → ")}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {r.distanceInKm ?? 0} km &middot;{" "}
                                                    {r.estimatedDurationInMinutes ?? 0} min
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleAssign}
                    disabled={submitting || loadingOptions || !partnerId || !routeId}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Assigning&hellip;
                        </>
                    ) : (
                        "Assign Driver"
                    )}
                </button>
            </motion.div>
        </div>
    );
}