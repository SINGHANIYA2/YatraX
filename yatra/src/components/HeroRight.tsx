"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bus, Route, Users } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import LiveMap from "./LiveMap";



export default function HeroRight() {
    const router = useRouter();
    const [date, setDate] = useState<Date>();
    const [tripType, setTripType] = useState("oneway");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");


    const stats = [
        {
            icon: Bus,
            title: "Active Buses",
            value: "128",
            color: "text-primary",
        },
        {
            icon: Route,
            title: "Routes",
            value: "56",
            color: "text-primary",
        },
        {
            icon: Users,
            title: "Passengers",
            value: "2.8K",
            color: "text-primary",
        },
    ];

    const handleSearch = () => {
        const Url = `/tracking?from=${from}&to=${to}&date=${date?.toISOString()}`
        router.push(Url);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[850px] xl:max-w-[900px] mx-auto bg-card border border-border/10 rounded-3xl p-3 sm:p-4 shadow-sm"
        >
            {/* MAP SECTION */}
            <div className="relative h-[280px] sm:h-[330px] lg:h-[420px] rounded-2xl overflow-hidden border border-border/10">

                <Image
                    src="/hero_map.png"
                    alt="Map"
                    fill
                    priority
                    className="object-cover"
                    sizes="full"
                />
                {/* <LiveMap/> */}

                <div className="absolute inset-0 bg-black/20" />

                {/* LIVE CARD */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-[160px] sm:w-[200px] lg:w-[230px] rounded-2xl bg-card border border-border/10 p-3 sm:p-5 z-20">

                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground text-md sm:text-base">
                            Live Tracking
                        </h3>

                        <span className="px-2 py-1 rounded-lg bg-success text-foreground text-[10px] sm:text-xs font-medium">
                            Live
                        </span>
                    </div>

                    <div className="mt-4 sm:mt-6">
                        <h2 className="text-lg sm:text-2xl lg:text-xs font-bold text-foreground">
                            KA01AB1234
                        </h2>

                        <p className="mt-2 text-[10px] sm:text-sm text-muted-foreground">
                            Bengaluru → Mysuru
                        </p>
                    </div>

                    <div className="mt-4 sm:mt-8">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            ETA
                        </p>

                        <h3 className="text-lg sm:text-xs lg:text-xl font-bold text-foreground mt-1">
                            01:20 PM
                        </h3>

                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                            40 km remaining
                        </p>
                    </div>

                </div>

                {/* DESKTOP STATS */}
                <div className="hidden lg:flex absolute right-4 top-4 w-[210px] flex-col gap-3 z-20">

                    {stats.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border/10 bg-card p-4"
                            >
                                <div className="flex gap-3">

                                    <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                                        <Icon
                                            size={20}
                                            className={item.color}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            {item.title}
                                        </p>

                                        <h3 className="text-xs font-bold text-foreground">
                                            {item.value}
                                        </h3>
                                    </div>

                                </div>
                            </div>
                        );
                    })}

                </div>

            </div>

            {/* MOBILE STATS */}
            <div className="grid grid-cols-2 gap-3 mt-4 lg:hidden">

                {stats.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="rounded-xl border border-border/10 bg-card p-3"
                        >
                            <Icon
                                size={18}
                                className={item.color}
                            />

                            <p className="text-xs text-muted-foreground mt-2">
                                {item.title}
                            </p>

                            <h3 className="text-lg font-bold text-foreground">
                                {item.value}
                            </h3>
                        </div>
                    );
                })}

            </div>

            {/* SEARCH SECTION */}
            <div className="mt-4 rounded-2xl border border-border/10 bg-black/10 p-4 sm:p-5">

                {/* TABS */}
                <div className="flex gap-8 border-b border-border/10 pb-4">

                    <button
                        onClick={() => setTripType("oneway")}
                        className={`pb-2 text-sm font-medium transition ${tripType === "oneway"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground"
                            }`}
                    >
                        One Way
                    </button>

                    <button
                        onClick={() => setTripType("roundtrip")}
                        className={`pb-2 text-sm font-medium transition ${tripType === "roundtrip"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground"
                            }`}
                    >
                        Round Trip
                    </button>

                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">

                    <div>
                        <label className="text-sm text-muted-foreground">
                            From
                        </label>

                        <input
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="Bengaluru"
                            className="mt-2 w-full rounded-xl border border-border/10 bg-card px-4 py-3 text-foreground outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground">
                            To
                        </label>

                        <input
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="Mysuru"
                            className="mt-2 w-full rounded-xl border border-border/10 bg-card px-4 py-3 text-foreground outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground">
                            Travel Date
                        </label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                className="
                                    mt-2
                                    w-full
                                    h-[50px]
                                    rounded-xl
                                    border border-border/10
                                    bg-card
                                    px-4
                                    text-foreground
                                    flex
                                    items-center
                                    justify-between
                                    hover:border-primary
                                    transition
                                    "
                                >
                                    <span>
                                        {date
                                            ? format(date, "dd MMM yyyy")
                                            : "Select Date"}
                                    </span>

                                    <CalendarIcon size={18} />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="start"
                                className="
                                        w-auto
                                        p-0
                                        border-border/10
                                        bg-muted-foreground
                                "
                            >
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={{ before: new Date() }}
                                    
                                /> 
                            </PopoverContent>
                        </Popover> 
                        
                    </div>

                    <button
                        onClick={handleSearch}
                        className="h-[50px] sm:mt-7 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors font-semibold hover:scale-[1.02] transition-all duration-300"
                    >
                        Track Vehicle
                    </button>

                </div>

            </div>
        </motion.div>

    );
}
