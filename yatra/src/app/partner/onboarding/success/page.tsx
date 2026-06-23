"use client";

import { motion } from "motion/react";
import { CheckCircle2, Clock, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden">

            {/* Blue Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb55,transparent_55%)]" />

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 -mt-13">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-xl rounded-3xl bg-slate-950/70 backdrop-blur-xl border border-blue-500/20 shadow-[0_0_60px_rgba(37,99,235,0.15)] p-8 text-center"
                >

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 12,
                        }}
                        className="flex justify-center"
                    >
                        <CheckCircle2
                            size={90}
                            className="text-green-500"
                        />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white mt-6">
                        Application Submitted
                    </h1>

                    <p className="text-slate-400 mt-4">
                        Your YatraX Partner application has been
                        successfully submitted and forwarded to
                        the selected admin for verification.
                    </p>

                    <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">

                        <div className="flex items-center justify-center gap-2 text-blue-400 font-medium">
                            <Clock size={18} />
                            Status: Pending Verification
                        </div>

                        <p className="text-slate-400 text-sm mt-3">
                            Expected review time is usually between
                            24 to 48 hours. You will be notified once
                            your application is approved.
                        </p>

                    </div>

                    <div className="mt-8 space-y-3">

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push("/")}
                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Go To Home
                        </motion.button>

                        <button
                            onClick={() =>
                                router.push("/partner/application-status")
                            }
                            className="w-full h-14 rounded-2xl border border-slate-700 text-slate-300 hover:border-blue-500 transition"
                        >
                            Track Application Status
                        </button>

                    </div>

                </motion.div>

            </div>
        </div>
    );
}