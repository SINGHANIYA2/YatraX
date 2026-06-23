"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {ArrowLeft,ArrowRight,CircleDashed, MapPin, UserCheck,Car,Search,} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LocationSuggestion {
    _id: string;
    name: string;
}

interface Admin {
    _id: string;
    name: string;

    standName: string;
    standAddress: string;

    city: string;

    totalVehicles: number;
    activePartners: number;
}

export default function LocationAdminPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<LocationSuggestion[] >([]);

    const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);

    const [admins, setAdmins] = useState<Admin[]>([]);

    const [adminId, setAdminId] = useState("");

    const [error, setError] = useState("");

    const searchLocation = async (value: string) => {
        setSearch(value);
        if (value.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const { data } = await axios.get(`/api/location/search?q=${value}`);
            setSuggestions(data.locations || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAdmins = async (locationId: string) => {
        try {
            const { data } = await axios.get(
                `/api/admins/location/${locationId}`
            );
            if(data) console.log("admin id" , data)
            setAdmins(data.admins || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleContinue = async () => {
        setError("");
        if (!selectedLocation || !adminId) {
            return setError(
                "Please select a location and admin"
            );
        }

        setLoading(true);

        try {
            localStorage.setItem(
                "partner-location-admin",
                JSON.stringify({
                    locationId: selectedLocation._id,
                    locationName: selectedLocation.name,
                    adminId,
                })
            );

            router.push("/partner/onboarding/review");
        } catch (error) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-auto">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb55,transparent_55%)]" />

            <div className="relative z-10 px-4 py-10">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_60px_rgba(37,99,235,0.15)] p-6 sm:p-8"
                >

                    {/* Header */}

                    <div className="relative text-center">

                        <button
                            onClick={() => router.back()}
                            className="absolute left-0 top-0 w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-white hover:border-blue-500 transition"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <p className="text-blue-400 text-sm">
                            Step 4 of 4
                        </p>

                        <h1 className="text-3xl font-bold text-white mt-2">
                            Select Location & Admin
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Search your city or area and choose the
                            nearest hub
                        </p>

                    </div>

                    {/* Progress */}

                    <div className="flex justify-center gap-2 mt-6">
                        <div className="h-2 w-4 rounded-full bg-blue-500" />
                        <div className="h-2 w-4 rounded-full bg-blue-500" />
                        <div className="h-2 w-4 rounded-full bg-blue-500" />
                        <div className="h-2 w-16 rounded-full bg-blue-500" />
                    </div>

                    {/* Search */}

                    <div className="mt-8">

                        <label className="text-sm text-slate-400">
                            Search City / Area / Stand
                        </label>

                        <div className="relative mt-2">

                            <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-blue-500">

                                <Search
                                    size={18}
                                    className="text-slate-400"
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        searchLocation(e.target.value)
                                    }
                                    placeholder="Ranchi, Harmu, Kanke..."
                                    className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none"
                                />

                            </div>

                            {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden z-50">

                                    {suggestions.map((location) => (
                                        <button
                                            key={location._id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedLocation(location);
                                                setSearch(location.name);
                                                setSuggestions([]);

                                                fetchAdmins(location._id);
                                            }}
                                            className="w-full px-4 py-3 text-left text-white hover:bg-slate-800 transition"
                                        >
                                            {location.name}
                                        </button>
                                    ))}

                                </div>
                            )}

                        </div>

                    </div>

                    {/* Selected Location */}

                    {selectedLocation && (
                        <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">

                            <div className="flex items-center gap-2 text-blue-400">

                                <MapPin size={18} />

                                <span>
                                    Selected Area:{" "}
                                    {selectedLocation.name}
                                </span>

                            </div>

                        </div>
                    )}

                    {/* Admin Cards */}

                    {admins.length > 0 && (
                        <div className="mt-8">

                            <h3 className="text-white font-semibold mb-4">
                                Available Admins
                            </h3>

                            <div className="grid gap-4">

                                {admins.map((admin) => (
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        key={admin._id}
                                        onClick={() =>
                                            setAdminId(admin._id)
                                        }
                                        className={`cursor-pointer rounded-2xl p-5 border transition ${adminId === admin._id
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-800 bg-slate-900/60"
                                            }`}
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h4 className="text-white font-semibold text-lg">
                                                    {admin.name}
                                                </h4>

                                                <div className="flex items-center gap-2 text-slate-400 mt-2">

                                                    <MapPin size={15} />

                                                    <span>
                                                        {admin.standName}
                                                    </span>

                                                </div>

                                                <p className="text-slate-500 text-sm mt-1">
                                                    {admin.standAddress}
                                                </p>

                                            </div>

                                            <UserCheck
                                                className={
                                                    adminId === admin._id
                                                        ? "text-blue-500"
                                                        : "text-slate-500"
                                                }
                                            />

                                        </div>

                                        <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-400">

                                            <div className="flex items-center gap-2">

                                                <Car size={16} />

                                                {admin.totalVehicles} Vehicles

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <UserCheck size={16} />

                                                {admin.activePartners} Drivers

                                            </div>

                                        </div>

                                    </motion.div>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* Error */}

                    {error && (
                        <p className="text-red-500 mt-4 text-sm">
                            * {error}
                        </p>
                    )}

                    {/* Continue */}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={handleContinue}
                        className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <CircleDashed className="animate-spin" />
                        ) : (
                            <>
                                Continue
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>

                </motion.div>

            </div>

        </div>
    );
}