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
                    border-green-500/20
                    bg-green-500/10
                    text-green-400
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
                <span className="text-blue-500">
                    YatraX
                </span>
            </h1>

            {/* Description */}
            <p
                className="
                    mt-6
                    text-md
                    text-gray-400
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
                    bg-gradient-to-r
                    from-blue-600
                    to-blue-500
                    text-white
                    font-semibold
                    shadow-[0_0_20px_rgba(37,99,235,.4)]
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
                    border-green-500/30
                    bg-green-500/5
                    text-green-400
                    font-semibold
                    hover:bg-green-500/10
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
                        className="text-green-400"
                    />
                    <span className="text-sm text-gray-300">
                        Secure Payments
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPinned
                        size={18}
                        className="text-green-400"
                    />
                    <span className="text-sm text-gray-300">
                        Live Tracking
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Headphones
                        size={18}
                        className="text-green-400"
                    />
                    <span className="text-sm text-gray-300">
                        24/7 Support
                    </span>
                </div>

            </div>
        </motion.div>


    );
}
