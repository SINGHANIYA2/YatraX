'use client'

import { trackingVehicles } from './demo'

import { Phone, Star } from 'lucide-react'
import { motion } from "motion/react"

type Props = {
    vehicle: any
}

export default function VehicleDetails({
    vehicle
}: Props) {
    return (
        <motion.div
            initial={{
opacity:0,
scale:.96
}}

animate={{
opacity:1,
scale:1
}}
            transition={{
duration:.35
}}
            className="
                w-full
                h-full
                rounded-2xl
                border
                border-blue-500/10
                bg-[#071427]
                p-[1px]
                shadow-[0_0_20px_rgba(59,130,246,0.12)]
                backdrop-blur-xl
                text-white
                font-sans
                overflow-hidden
                "
            >
            <div className="
                rounded-2xl
                border
                border-blue-500/10
                bg-[#071427]
                p-4
                sm:p-5
                lg:p-6
                shadow-[0_0_20px_rgba(59,130,246,0.12)]
                text-white
                font-sans
            ">

                {/* Header */}
                <div
                    className="
                        mb-4
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                        "
                >
                    <h2
                        className="
                            text-sm
                            sm:text-base
                            font-semibold
                            break-all
                            "
                    >
                        {vehicle.id}
                    </h2>

                    <span
                        className="
                            rounded-full
                            bg-green-500/20
                            px-2
                            sm:px-3
                            py-1
                            text-[10px]
                            sm:text-xs
                            font-medium
                            text-green-400
                            "
                    >
                        Live
                    </span>
                </div>

                {/* Vehicle */}
                <div
                    className="
                        mb-5
                        flex
                        items-center
                        gap-3
                        min-w-0
                        "
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-xl">
                        🚌
                    </div>

                    <div>
                        <h3
                            className="
                                font-medium
                                truncate
                                "
                        >
                            {vehicle.model}
                        </h3>
                    </div>
                </div>

                {/* Driver */}
                <div
                    className="
                        mb-5
                        flex
                        flex-col
                        sm:flex-row
                        items-start
                        sm:items-center
                        justify-between
                        gap-4
                        "
                >
                    <div className="flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/100"
                            alt="Driver"
                            className="h-10 w-10 rounded-full"
                        />

                        <div>
                            <h3
                                className="
                                    text-sm
                                    font-medium
                                    break-words
                                    "
                            >
                                {vehicle.driver.name}
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

                    <button
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            hover:bg-blue-700
                            transition-all
                            duration-300
                            hover:scale-110
                            active:scale-95
                            shadow-lg
                            shadow-blue-500/20
                            "
                    >
                        <Phone size={16} />
                    </button>
                </div>

                <div className="mb-5 border-t border-slate-800" />

                {/* Stats */}
                <div
                    className="
                        grid
                        grid-cols-2
                        sm:grid-cols-2
                        gap-4
                        sm:gap-5
                        text-xs
                        sm:text-sm
                        "
                >

                    <div>
                        <p className="text-slate-400">Speed</p>
                        <p
                            className="
                                mt-1
                                font-semibold
                                break-words
                                "
                        >
                            {vehicle.speed} km/h</p>
                    </div>

                    <div>
                        <p className="text-slate-400">Fuel</p>
                        <p className="mt-1 font-semibold">{vehicle.fuel}%</p>
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
        </motion.div >
    )
}