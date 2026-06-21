'use client'

import { Phone, Star } from 'lucide-react'

import { motion } from "motion/react"

export default function VehicleDetails() {
    return (
        <motion.div
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: 0.2
            }}
            className="rounded-2xl border
            border-blue-500/10
            bg-[#071427]
            p-[1px]
            shadow-[0_0_15px_rgba(59,130,246,0.15)]
            text-white font-sans"
        >
            <div className="rounded-2xl border border-blue-500/10
             bg-[#071427] p-4 border
            shadow-[0_0_15px_rgba(59,130,246,0.15)]
             text-white font-sans">

                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                        JH01AB1234
                    </h2>

                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                        Live
                    </span>
                </div>

                {/* Vehicle */}
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-xl">
                        🚌
                    </div>

                    <div>
                        <h3 className="font-medium">
                            Volvo AC Sleeper
                        </h3>
                    </div>
                </div>

                {/* Driver */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/100"
                            alt="Driver"
                            className="h-10 w-10 rounded-full"
                        />

                        <div>
                            <h3 className="text-sm font-medium">
                                Rahul Kumar
                            </h3>

                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star
                                    size={12}
                                    fill="currentColor"
                                />
                                <span className="text-xs">
                                    4.8
                                </span>
                            </div>
                        </div>
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700">
                        <Phone size={16} />
                    </button>
                </div>

                <div className="mb-5 border-t border-slate-800" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-y-5 text-sm">

                    <div>
                        <p className="text-slate-400">Speed</p>
                        <p className="mt-1 font-semibold">58 km/h</p>
                    </div>

                    <div>
                        <p className="text-slate-400">Fuel</p>
                        <p className="mt-1 font-semibold">68%</p>
                    </div>

                    <div>
                        <p className="text-slate-400">ETA</p>
                        <p className="mt-1 font-semibold">32 min</p>
                    </div>

                    <div>
                        <p className="text-slate-400">Distance Left</p>
                        <p className="mt-1 font-semibold">45 km</p>
                    </div>

                    <div>
                        <p className="text-slate-400">From</p>
                        <p className="mt-1 font-semibold">Ranchi</p>
                    </div>

                    <div>
                        <p className="text-slate-400">To</p>
                        <p className="mt-1 font-semibold">Jamshedpur</p>
                    </div>

                    <div>
                        <p className="text-slate-400">Status</p>
                        <p className="mt-1 font-semibold text-green-400">
                            On Time
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-400">Last Updated</p>
                        <p className="mt-1 font-semibold">
                            2 min ago
                        </p>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}