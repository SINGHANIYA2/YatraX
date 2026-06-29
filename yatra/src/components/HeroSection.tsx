/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect } from 'react'
import { motion } from "motion/react";
import { MapPinned, Headphones } from "lucide-react";
import Link from "next/link";
import { Ticket, MapPin, Route, Bus, Shield, Bell } from "lucide-react";
import HeroLeft from './HeroLeft';
import HeroRight from './HeroRight';
import HeroFeature from './HeroFeature';
import StatsSection from './StatsSection';
import { getSocket } from '@/lib/socket';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const features = [
    {
        icon: Ticket,
        title: "Online Ticket Booking",
        desc: "Book tickets anytime, anywhere.",
        href: "/booking"
    },
    {
        icon: MapPin,
        title: "Live GPS Tracking",
        desc: "Track your vehicle live.",
        href: "/tracking"
    },
    {
        icon: Route,
        title: "Smart Route Management",
        desc: "Optimized routes for operators.",
        href: "/routes"
    },
    {
        icon: Bus,
        title: "Fleet Administration",
        desc: "Manage vehicles and drivers.",
        href: "/fleet"
    },
    {
        icon: Shield,
        title: "Secure Payments",
        desc: "100% secure payment gateway.",
        href: "/payments"
    },
    {
        icon: Bell,
        title: "Instant Notifications",
        desc: "Real-time alerts and updates.",
        href: "/notifications"
    }
];
function HeroSection() {

    const { partnerData } = useSelector((state: RootState) => state.partner)
    const session = useSession()
    useEffect(() => {
        if (session.status !== "authenticated" || !partnerData )
            return;

        const socket = getSocket();

        socket.emit("identity", {
            partnerId:
                partnerData._id,
            vehicleId:
                partnerData.assignedVehicleId,
        });
    }, [
        session.status,
        partnerData,
    ]);

    return (
        <>
            <section className="relative min-h-screen overflow-auto bg-gradient-to-b from-[#020617] via-[#030712] to-black text-white pt-28 pb-16">

                <div className="absolute top-0 left-0 w-[700px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />

                <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />

                <div className="relative z-10 max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 justify-between">

                    {/* Top Hero */}
                    <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 xl:gap-12 items-center">
                        <HeroLeft />
                        <HeroRight />
                    </div>
                    {/* Features */}
                    <HeroFeature />
                    {/* Stats */}
                    <StatsSection />

                </div>

            </section>
        </>
    )
}

export default HeroSection