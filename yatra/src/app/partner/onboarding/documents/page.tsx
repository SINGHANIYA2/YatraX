"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
    ArrowLeft,
    ArrowRight,
    CircleDashed,
    FileCheck,
    UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

type DocType = "profilePhoto" | "aadharFront" | "aadharBack" | "drivingLicense";

type UploadProps = {
    title: string;
    file: File | null;
    onChange: (file: File | null) => void;
};

function UploadCard({title,file, onChange,}: UploadProps){
    return (
        <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 cursor-pointer hover:border-blue-500 transition">
            <div>
                <h3 className="text-white font-medium">
                    {title}
                </h3>

                <p className="text-xs text-slate-400 mt-1 truncate max-w-[220px]">
                    {file
                        ? file.name
                        : "Upload file"}
                </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <UploadCloud size={18} />
            </div>

            <input
                hidden
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                    onChange(
                        e.target.files?.[0] || null
                    )
                }
            />
        </label>
    );
}


export default function DocumentsPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [docs, setDocs] = useState({
        profilePhoto: null as File | null,
        aadharFront: null as File | null,
        aadharBack: null as File | null,
        drivingLicense: null as File | null,
    });

    const handleFile = (type: DocType, file: File | null) => {
        if (!file) return;
        setDocs((prev) => ({
            ...prev,
            [type]: file,
        }));
    };

    const handleContinue = async () => {
        setError("");

        if (!docs.profilePhoto || !docs.aadharFront || !docs.aadharBack ||!docs.drivingLicense){
            return setError(
                "Please upload all documents"
            );
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append(
                "profilePhoto",
                docs.profilePhoto
            );

            formData.append(
                "aadharFront",
                docs.aadharFront
            );

            formData.append(
                "aadharBack",
                docs.aadharBack
            );

            formData.append(
                "drivingLicense",
                docs.drivingLicense
            );
            

            const { data } = await axios.post( "/api/upload/partner-documents",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (!data.success) {
                throw new Error(data.message || "Failed to upload documents");
            }

            console.log(data)

            localStorage.setItem(
                "partner-documents",
                JSON.stringify(data.documents)
            );

            console.log("document : ",data)

            router.push("/partner/onboarding/bank-details");
        } catch (error: any) {
            console.log(error);

            setError(
                error?.response?.data?.message ||
                "Failed to upload documents"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-auto">
            <div className="absolute inset-0 bg-[rgba(53,64,89,0.33)]" />

            <div className="relative z-10 px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_60px_rgba(37,99,235,0.15)] p-6 sm:p-8"
                >
                    <div className="relative text-center">
                        <button
                            onClick={() => router.back()}
                            className="absolute left-0 top-0 w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-white hover:border-blue-500"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <p className="text-blue-400 text-sm">
                            Step 2 of 4
                        </p>

                        <h1 className="text-3xl font-bold text-white mt-2">
                            Upload Documents
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Required for verification
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        <div className="h-2 w-4 rounded-full bg-blue-500" />
                        <div className="h-2 w-16 rounded-full bg-blue-500" />
                        <div className="h-2 w-4 rounded-full bg-slate-700" />
                        <div className="h-2 w-4 rounded-full bg-slate-700" />
                    </div>

                    <div className="space-y-4 mt-8">
                        <UploadCard
                            title="Profile Photo"
                            file={docs.profilePhoto}
                            onChange={(file) =>
                                handleFile(
                                    "profilePhoto",
                                    file
                                )
                            }
                        />

                        <UploadCard
                            title="Aadhaar Front"
                            file={docs.aadharFront}
                            onChange={(file) =>
                                handleFile(
                                    "aadharFront",
                                    file
                                )
                            }
                        />

                        <UploadCard
                            title="Aadhaar Back"
                            file={docs.aadharBack}
                            onChange={(file) =>
                                handleFile(
                                    "aadharBack",
                                    file
                                )
                            }
                        />

                        <UploadCard
                            title="Driving License"
                            file={docs.drivingLicense}
                            onChange={(file) =>
                                handleFile(
                                    "drivingLicense",
                                    file
                                )
                            }
                        />
                    </div>

                    <div className="mt-6 flex gap-3 text-sm text-slate-400">
                        <FileCheck size={18} />
                        Documents are encrypted and securely
                        stored.
                    </div>

                    {error && (
                        <p className="text-red-500 mt-4 text-sm">
                            * {error}
                        </p>
                    )}

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
