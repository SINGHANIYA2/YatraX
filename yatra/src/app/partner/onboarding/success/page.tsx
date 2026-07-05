"use client";

import { motion } from "motion/react";
import { CheckCircle2, Clock, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">

            {/* Blue Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--border),transparent_55%)]" />

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 -mt-13">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-xl rounded-3xl bg-card border border-primary/20 shadow-sm p-8 text-center"
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
                            className="text-success"
                        />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-foreground mt-6">
                        Application Submitted
                    </h1>

                    <p className="text-muted-foreground mt-4">
                        Your YatraX Partner application has been
                        successfully submitted and forwarded to
                        the selected admin for verification.
                    </p>

                    <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/10 p-5">

                        <div className="flex items-center justify-center gap-2 text-primary font-medium">
                            <Clock size={18} />
                            Status: Pending Verification
                        </div>

                        <p className="text-muted-foreground text-sm mt-3">
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
                            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Go To Home
                        </motion.button>

                        <button
                            onClick={() =>
                                router.push("/partner/application-status")
                            }
                            className="w-full h-14 rounded-2xl border border-border text-muted-foreground hover:border-primary transition"
                        >
                            Track Application Status
                        </button>

                    </div>

                </motion.div>

            </div>
        </div>
    );
}