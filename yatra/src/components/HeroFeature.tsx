import React from 'react'
import Link from "next/link";
import { Ticket, MapPin, Route, Bus, ShieldCheck, Bell } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
    {
        title: "Online Ticket Booking",
        description: "Book tickets anytime, anywhere with ease.",
        icon: Ticket,
        href: "/booking",
        color: "bg-secondary",
        iconColor: "text-primary",
    },
    {
        title: "Real-Time GPS Tracking",
        description: "Track your bus live with accurate location updates.",
        icon: MapPin,
        href: "/tracking",
        color: "bg-secondary",
        iconColor: "text-success",
    },
    {
        title: "Smart Route Management",
        description: "Optimized routes for faster and safer travel.",
        icon: Route,
        href: "/routes",
        color: "bg-secondary",
        iconColor: "text-primary",
    },
    {
        title: "Instant Notifications",
        description: "Get real-time alerts for updates and changes.",
        icon: Bell,
        href: "/notifications",
        color: "bg-secondary",
        iconColor: "text-primary",
    },
];

function HeroFeature() {
    return (
        <section className="mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                {features.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                        <Link
                            key={feature.title}
                            href={feature.href}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                }}
                                className="
                                        group
                                        h-full
                                        bg-card
                                        border border-border/10
                                        rounded-2xl
                                        p-5
                                        cursor-pointer
                                        hover:border-primary/40
                                        hover:shadow-sm
                                        transition-all
                                        duration-300
                                    "
                            >
                                {/* ICON */}
                                <div
                                    className={`
                                        w-14 h-14 rounded-xl
                                        ${feature.color}
                                        flex items-center justify-center
                                        `}
                                >
                                    <Icon
                                        size={26}
                                        className={feature.iconColor}
                                    />
                                </div>

                                {/* TITLE */}
                                <h3 className="mt-5 text-foreground font-semibold text-lg">
                                    {feature.title}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* ARROW */}
                                <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                                    Explore →
                                </div>

                            </motion.div>
                        </Link>
                    );
                })}

            </div>
        </section>
    );
}

export default HeroFeature