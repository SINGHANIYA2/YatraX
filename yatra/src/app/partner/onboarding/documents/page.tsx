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
        <label className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 cursor-pointer hover:border-primary transition">
            <div>
                <h3 className="text-foreground font-medium">
                    {title}
                </h3>

                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[220px]">
                    {file
                        ? file.name
                        : "Upload file"}
                </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-foreground">
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
            setLoading(false)
            router.push("/partner/onboarding/bank-details");
        } catch (error: any) {
            console.log(error);

            setError(
                error?.response?.data?.message ||
                "Failed to upload documents"
            );
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-auto">
            <div className="absolute inset-0 bg-[rgba(53,64,89,0.33)]" />

            <div className="relative z-10 px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto rounded-3xl bg-card border border-primary/20 shadow-sm p-6 sm:p-8"
                >
                    <div className="relative text-center">
                        <button
                            onClick={() => router.back()}
                            className="absolute left-0 top-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <p className="text-primary text-sm">
                            Step 2 of 4
                        </p>

                        <h1 className="text-3xl font-bold text-foreground mt-2">
                            Upload Documents
                        </h1>

                        <p className="text-muted-foreground mt-2">
                            Required for verification
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        <div className="h-2 w-4 rounded-full bg-primary" />
                        <div className="h-2 w-16 rounded-full bg-primary" />
                        <div className="h-2 w-4 rounded-full bg-secondary" />
                        <div className="h-2 w-4 rounded-full bg-secondary" />
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

                    <div className="mt-6 flex gap-3 text-sm text-muted-foreground">
                        <FileCheck size={18} />
                        Documents are encrypted and securely
                        stored.
                    </div>

                    {error && (
                        <p className="text-destructive mt-4 text-sm">
                            * {error}
                        </p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={handleContinue}
                        className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
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
