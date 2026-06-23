"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CircleDashed,
    CreditCard,
    Landmark,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BankDetailsPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        accountHolder: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        upiId: "",
    });

    const handleContinue = async () => {
        setError("");

        if (
            !form.accountHolder ||
            !form.accountNumber ||
            !form.ifsc ||
            !form.bankName
        ) {
            return setError("Please fill all required fields");
        }

        setLoading(true);

        try {
            localStorage.setItem(
                "partner-bank-details",
                JSON.stringify(form)
            );

            router.push(
                "/partner/onboarding/location-admin"
            );
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    type InputProps = {
        icon: React.ReactNode;
        placeholder: string;
        value: string;
        onChange: (
            e: React.ChangeEvent<HTMLInputElement>
        ) => void;
    };

    function Input({
        icon,
        placeholder,
        value,
        onChange,
    }: InputProps) {
        return (
            <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-blue-500 transition">
                <div className="text-slate-400">
                    {icon}
                </div>

                <input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-auto">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb55,transparent_55%)]" />

            <div className="relative z-10 px-4 py-10">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_60px_rgba(37,99,235,0.15)] p-6 sm:p-8"
                >

                    <div className="relative text-center">

                        <button
                            onClick={() => router.back()}
                            className="absolute left-0 top-0 w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-white hover:border-blue-500 transition"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <p className="text-blue-400 text-sm">
                            Step 3 of 4
                        </p>

                        <h1 className="text-3xl font-bold text-white mt-2">
                            Bank Details
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Add payout account information
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        <div className="h-2 w-4 rounded-full bg-blue-500" />
                        <div className="h-2 w-4 rounded-full bg-blue-500" />
                        <div className="h-2 w-16 rounded-full bg-blue-500" />
                        <div className="h-2 w-4 rounded-full bg-slate-700" />
                    </div>

                    <div className="space-y-5 mt-8">

                        <Input
                            icon={<User size={18} />}
                            placeholder="Account Holder Name"
                            value={form.accountHolder}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    accountHolder: e.target.value,
                                })
                            }
                        />

                        <Input
                            icon={<CreditCard size={18} />}
                            placeholder="Account Number"
                            value={form.accountNumber}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    accountNumber: e.target.value,
                                })
                            }
                        />

                        <Input
                            icon={<Landmark size={18} />}
                            placeholder="IFSC Code"
                            value={form.ifsc}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    ifsc: e.target.value.toUpperCase(),
                                })
                            }
                        />

                        <Input
                            icon={<Building2 size={18} />}
                            placeholder="Bank Name"
                            value={form.bankName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    bankName: e.target.value,
                                })
                            }
                        />

                        <Input
                            icon={<CreditCard size={18} />}
                            placeholder="UPI ID (Optional)"
                            value={form.upiId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    upiId: e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-slate-400">
                        Your bank details are encrypted and will only
                        be used for payouts.
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

