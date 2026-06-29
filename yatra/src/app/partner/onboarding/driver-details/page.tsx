"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Car,
    MapPin,
    Phone,
    Shield,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";

type InputProps = {
    icon: React.ReactNode;
    placeholder?: string;
    value?: string;
    type?: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
};

function Input({
    icon,
    placeholder,
    value,
    onChange,
    type = "text",
}: InputProps) {
    return (
        <div>
            <div
                className="flex items-center gap-3 bg-slate-900/60 border  border-slate-800 rounded-xl px-4 py-3"
            >
                <div className="text-slate-400">
                    {icon}
                </div>

                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="
                    flex-1
                    bg-transparent
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    "
                />
            </div>
        </div>
    );
}

export default function DriverDetailsPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        dob: "",
        gender: "",
        dlNumber: "",
        experience: "",
        emergencyContact: "",
        address: "",
    });

    const [error, setError] = useState("");

    const handleContinue = () => {
        setError("");

        if (!form.dob || !form.gender || !form.dlNumber || !form.experience ||
            !form.emergencyContact || !form.address
        ) {
            return setError("Please fill all fields");
        }

        const dlRegex =  /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{6,7}$/;

        if (!dlRegex.test( form.dlNumber
                .trim()
                .toUpperCase()
            )
        ) {
            return setError(
            "Please enter a valid Driving Licence number"
            );
    }

        localStorage.setItem(
            "driver-details",
            JSON.stringify(form)
        );

        router.push("/partner/onboarding/documents");
    };

    return (
        <div className="min-h-[80%] bg-[#020617] relative overflow-auto">

            {/* Glow */}
            <div className="absolute inset-0 " />

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
                    w-full
                    max-w-2xl
                    rounded-3xl
                    bg-slate-950/70
                    backdrop-blur-xl
                    border
                    border-blue-500/20
                    shadow-[0_0_60px_rgba(37,99,235,0.15)]
                    p-6 sm:p-8
                    "
                >
                    {/* Header */}
                    <div className="relative text-center">

                        <button
                            onClick={() => router.back()}
                            className="
                                absolute
                                left-0
                                top-0
                                w-10
                                h-10
                                rounded-full
                                border
                                border-slate-700
                                flex
                                items-center
                                justify-center
                                text-white
                                hover:border-blue-500
                                transition
                                "
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <p className="text-blue-400 text-sm">
                            Step 1 of 4
                        </p>

                        <h1 className="text-3xl font-bold text-white mt-2">
                            Driver Information
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Provide your driving details for verification
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="h-2 w-10 rounded-full bg-blue-500" />
                        <div className="h-2 w-2 rounded-full bg-slate-700" />
                        <div className="h-2 w-2 rounded-full bg-slate-700" />
                        <div className="h-2 w-2 rounded-full bg-slate-700" />
                    </div>

                    {/* Form */}
                    <div className="space-y-5 mt-8">
                         <label className="text-sm text-slate-400">
                                Date of birth
                        </label>
                        <Input
                            icon={<Calendar size={18} />}
                            type="date"
                            value={form.dob}
                            onChange={(e) =>
                                setForm({ ...form, dob: e.target.value })
                            }
                        
                        />

                        <div>
                            <label className="text-sm text-slate-400">
                                Gender
                            </label>

                            <select
                                value={form.gender}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        gender: e.target.value,
                                    })
                                }
                                className="
                                    mt-2
                                    w-full
                                    bg-slate-900/60
                                    border
                                    border-slate-800
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                    focus:border-blue-500
                                "
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            icon={<Shield size={18} />}
                            placeholder="Driving License Number"
                            value={form.dlNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    dlNumber: e.target.value,
                                })
                            }
                        />

                        <Input
                            icon={<Car size={18} />}
                            placeholder="Driving Experience (Years)"
                            value={form.experience}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    experience: e.target.value,
                                })
                            }
                        />

                        <Input
                            icon={<Phone size={18} />}
                            placeholder="Emergency Contact"
                            value={form.emergencyContact}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    emergencyContact: e.target.value,
                                })
                            }
                        />

                        <div>
                            <label className="text-sm text-slate-400">
                                Address
                            </label>

                            <div className="mt-2 flex gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                                <MapPin
                                    size={18}
                                    className="text-slate-400 mt-1"
                                />

                                <textarea
                                    rows={4}
                                    placeholder="Full Address"
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            address: e.target.value,
                                        })
                                    }
                                    className="
                  flex-1
                  bg-transparent
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  resize-none
                "
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 mt-5 text-sm">
                            * {error}
                        </p>
                    )}

                    {/* Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinue}
                        className="
            mt-8
            w-full
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-blue-500
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
          "
                    >
                        Continue
                        <ArrowRight size={18} />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}

