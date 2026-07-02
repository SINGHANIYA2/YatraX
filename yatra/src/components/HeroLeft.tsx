"use client";

import { motion } from "motion/react";
import { Shield, MapPinned, Headphones } from "lucide-react";
import Link from "next/link";

export default function HeroLeft() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col mt-[-20px]"
        >
            {/* Badge */} 
            <div
                className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-full
                    border
                    border-success/20
                    bg-success/10
                    text-success
                    text-sm
                    w-fit
                "
            >
                ✨ One Platform. Every Journey. </div>

            {/* Heading */}
            <h1
                className="
                    mt-8
                    text-5xl
                    md:text-6xl
                    font-bold
                    leading-tight
                "
            >
                Book, Track &
                <br />
                Travel Smarter
                <br />
                with{" "}
                <span className="text-primary">
                    YatraX
                </span>
            </h1>

            {/* Description */}
            <p
                className="
                    mt-6
                    text-md
                    text-muted-foreground
                    max-w-xl
                    leading-relaxed
                "
            >
                A unified platform for ticket booking,
                live bus tracking, route management,
                fleet operations and seamless
                transportation services.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
                <Link
                    href="/booking"
                    className="
                    px-8
                    py-4
                    rounded-xl
                    bg-primary text-primary-foreground hover:bg-primary-hover transition-colors
                    font-semibold
                    shadow-sm
                    hover:scale-105
                    transition
                    "
                >
                    Book Tickets
                </Link>

                <Link
                    href="/tracking"
                    className="
                    px-8
                    py-4
                    rounded-xl
                    border
                    border-success/30
                    bg-success/5
                    text-success
                    font-semibold
                    hover:bg-success/10
                    transition
                "
                >
                    Track Vehicle
                </Link>
            </div>

            {/* Features */}
            <div className="mt-10 flex flex-wrap gap-8">

                <div className="flex items-center gap-2">
                    <Shield
                        size={18}
                        className="text-success"
                    />
                    <span className="text-sm text-muted-foreground">
                        Secure Payments
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPinned
                        size={18}
                        className="text-success"
                    />
                    <span className="text-sm text-muted-foreground">
                        Live Tracking
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Headphones
                        size={18}
                        className="text-success"
                    />
                    <span className="text-sm text-muted-foreground">
                        24/7 Support
                    </span>
                </div>

            </div>
        </motion.div>


    );
}
