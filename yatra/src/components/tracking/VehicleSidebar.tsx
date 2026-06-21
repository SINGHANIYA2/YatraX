'use client'

import {
    Bus,
    Car,
    Truck,
    Search,
    ChevronDown,
} from 'lucide-react'

import { motion } from "motion/react"

const vehicles = [
    {
        id: 'JH01AB1234',
        type: 'Bus',
        model: 'Volvo AC Sleeper',
        speed: 58,
        eta: 32,
        status: 'Live',
        icon: Bus,
        color: 'text-blue-400',
    },
    {
        id: 'JH01CT4567',
        type: 'Taxi',
        model: 'Sedan',
        speed: 45,
        eta: 28,
        status: 'Live',
        icon: Car,
        color: 'text-yellow-400',
    },
    {
        id: 'JH01MN7890',
        type: 'Van',
        model: 'Tempo Traveller',
        speed: 50,
        eta: 35,
        status: 'Live',
        icon: Truck,
        color: 'text-green-400',
    },
    {
        id: 'JH01RT2345',
        type: 'Auto',
        model: 'Auto Rickshaw',
        speed: 40,
        eta: 20,
        status: 'Live',
        icon: Bus,
        color: 'text-orange-400',
    },
    {
        id: 'JH01AB5678',
        type: 'Bus',
        model: 'Volvo AC Sleeper',
        speed: 60,
        eta: 30,
        status: 'Live',
        icon: Bus,
        color: 'text-blue-400',
    },
    {
        id: 'JH01AB9876',
        type: 'Bus',
        model: 'Volvo AC Sleeper',
        speed: 55,
        eta: 25,
        status: 'Live',
        icon: Bus,
        color: 'text-blue-400',
    },
]

export default function VehicleSidebar() {
    return (
        <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
                duration: 0.9,
                ease: "easeOut"
            }}
            className="h-full flex flex-col rounded-2xl"
        >

            {/* Top Section */}
            <div
                className="
            rounded-2xl
            border
            border-blue-500/10
            bg-[#071427]
            p-4
            text-white
            "
            >

                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">
                        Live Vehicles
                    </h2>

                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    <span className="text-sm text-slate-400">
                        18 Vehicles Online
                    </span>
                </div>

                <div className="relative my-[10px]">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        placeholder="Search vehicle..."
                        className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-blue-500
                    "
                    />
                </div>

                <button
                    className="
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-3
                "
                >
                    <span className="text-sm">
                        All Types
                    </span>

                    <ChevronDown size={18} />
                </button>

            </div>

            {/* Bottom Section */}
            <div
                className="
            flex-1
            min-h-0
            flex
            flex-col
            rounded-2xl
            overflow-hidden
            border
            border-blue-500/10
            bg-gradient-to-b
            from-[#10284f]
            to-[#0b1f3d]
            mt-[4px]
            "
            >

                <div
                    className="
                flex-1
                min-h-0
                bg-[#061630]
                shadow-[0_0_25px_rgba(59,130,246,0.25)]
                overflow-y-auto
                scrollbar-hide
                p-3
                space-y-2
                "
                >

                    {vehicles.map((vehicle, index) => {
                        const Icon = vehicle.icon

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0,
                                }}
                                whileHover={{
                                    y: -2,
                                    scale: 1.018,
                                }}
                                key={vehicle.id}
                                className={`cursor-pointer bg-[#071427] rounded-2xl border p-4 transition-all hover:border-blue-900 hover:bg-slate-900
                            ${index === 0
                                        ? 'border-blue-900 bg-slate-900'
                                        : 'border-slate-800'
                                    }`}
                            >
                                <div className="flex items-start justify-between">

                                    <div className="flex gap-3">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ${vehicle.color}`}
                                        >
                                            <Icon size={26} />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {vehicle.id}
                                            </h3>

                                            <p className="text-sm text-slate-400">
                                                {vehicle.type} • {vehicle.model}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                                        {vehicle.status}
                                    </span>

                                </div>

                                <div className="mt-4 flex items-center justify-between text-sm">

                                    <div>
                                        <p className="text-slate-500">
                                            Speed
                                        </p>

                                        <p>
                                            {vehicle.speed} km/h
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-slate-500">
                                            ETA
                                        </p>

                                        <p>
                                            {vehicle.eta} min
                                        </p>
                                    </div>

                                </div>
                            </motion.div>
                        )
                    })}

                </div>

            </div>

        </motion.div>
    )
}