/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    ArrowLeft,
    CircleDashed,
    CheckCircle2,
    User,
    CreditCard,
    MapPin,
    FileCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";


function Section({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

            <div className="flex items-center gap-2 text-white font-semibold mb-4">
                {icon}
                {title}
            </div>

            <div className="space-y-3">
                {children}
            </div>

        </div>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    return (
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">

            <span className="text-slate-400">
                {label}
            </span>

            <span className="text-white text-sm">
                {value || "-"}
            </span>

        </div>
    );
}

export default function ReviewPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [driver, setDriver] = useState<any>(null);
    const [documents, setDocuments] = useState<any>(null);
    const [bank, setBank] = useState<any>(null);
    const [locationAdmin, setLocationAdmin] = useState<any>(null);

    useEffect(() => {
        const driverData = localStorage.getItem("driver-details");

        const docsData = localStorage.getItem("partner-documents");

        const bankData = localStorage.getItem("partner-bank-details");

        const locationData = localStorage.getItem("partner-location-admin");

        if (driverData)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDriver(JSON.parse(driverData));

        if (docsData) {
            setDocuments(JSON.parse(docsData));
        }

        if (bankData)
            setBank(JSON.parse(bankData));

        if (locationData)
            setLocationAdmin(JSON.parse(locationData));
    }, []);

    const handleSubmit = async () => {
        setLoading(true);

        try {

            await axios.post(
                "/api/partner/application",
                {
                    ...driver,

                    adminId: locationAdmin.adminId,
                    locationId: locationAdmin.locationId,

                    bankDetails: bank,

                    documents: {
                        profilePhoto: documents.profilePhoto,
                        aadharFront: documents.aadharFront,
                        aadharBack: documents.aadharBack,
                        drivingLicense: documents.drivingLicense,
                    },
                }
            );

            localStorage.clear();

            router.push("/partner/onboarding/success");

        }

        // try {
        //     // const formData = new FormData();

        //     // // Driver Details
        //     // formData.append("driverDetails",JSON.stringify(driver));

        //     // // Bank Details
        //     // formData.append("bankDetails", JSON.stringify(bank));

        //     // // Location
        //     // formData.append("locationAdmin",JSON.stringify(locationAdmin));

        //     // // Files
        //     // formData.append("profilePhoto",documents.profilePhoto );

        //     // formData.append("aadharFront", documents.aadharFront);

        //     // formData.append("aadharBack", documents.aadharBack);
        //     // formData.append( "drivingLicense", documents.drivingLicense);

        //     await axios.post("/api/partner/application", formData,
        //         {
        //             headers: {
        //                 "Content-Type":
        //                     "multipart/form-data",
        //             },
        //         }
        //     );

        //     localStorage.clear();

        //     router.push("/partner/onboarding/success");
        // } 
        catch (error) {
            console.log(error);
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

                    <div className="relative text-center">

                        <button
                            onClick={() => router.back()}
                            className="absolute left-0 top-0 w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-white hover:border-blue-500"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <p className="text-blue-400 text-sm">
                            Final Step
                        </p>

                        <h1 className="text-3xl font-bold text-white mt-2">
                            Review Application
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Please verify your details before
                            submission
                        </p>
                    </div>

                    {/* Driver Details */}

                    <Section
                        icon={<User size={18} />}
                        title="Driver Details"
                    >
                        <Info
                            label="Driving License"
                            value={driver?.dlNumber}
                        />

                        <Info
                            label="Experience"
                            value={`${driver?.experience} Years`}
                        />

                        <Info
                            label="Emergency Contact"
                            value={driver?.emergencyContact}
                        />

                        <Info
                            label="Address"
                            value={driver?.address}
                        />
                    </Section>

                    {/* Documents */}

                    <Section
                        icon={<FileCheck size={18} />}
                        title="Documents"
                    >
                        <Info
                            label="Profile Photo"
                            value={
                                documents?.profilePhoto
                                    ? "Uploaded"
                                    : "Not Uploaded"
                            }
                        />

                        <Info
                            label="Aadhaar Front"
                            value={
                                documents?.aadharFront
                                    ? "Uploaded"
                                    : "Not Uploaded"
                            }
                        />

                        <Info
                            label="Aadhaar Back"
                            value={
                                documents?.aadharBack
                                    ? "Uploaded"
                                    : "Not Uploaded"
                            }
                        />

                        <Info
                            label="Driving License"
                            value={
                                documents?.drivingLicense
                                    ? "Uploaded"
                                    : "Not Uploaded"
                            }
                        />
                    </Section>

                    {/* Bank */}

                    <Section
                        icon={<CreditCard size={18} />}
                        title="Bank Details"
                    >
                        <Info
                            label="Account Holder"
                            value={bank?.accountHolder}
                        />

                        <Info
                            label="Bank Name"
                            value={bank?.bankName}
                        />

                        <Info
                            label="IFSC"
                            value={bank?.ifsc}
                        />

                        <Info
                            label="UPI"
                            value={
                                bank?.upiId || "Not Provided"
                            }
                        />
                    </Section>

                    {/* Location */}

                    <Section
                        icon={<MapPin size={18} />}
                        title="Location & Admin"
                    >
                        <Info
                            label="Location ID"
                            value={locationAdmin?.locationId}
                        />

                        <Info
                            label="Admin ID"
                            value={locationAdmin?.adminId}
                        />
                    </Section>

                    <div className="mt-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 flex gap-3">
                        <CheckCircle2 className="text-blue-400" />
                        <p className="text-slate-300 text-sm">
                            By submitting this application,
                            you confirm that all information
                            provided is accurate.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <CircleDashed className="animate-spin" />
                        ) : (
                            "Submit Application"
                        )}
                    </motion.button>

                </motion.div>
            </div>
        </div>
    );
}

