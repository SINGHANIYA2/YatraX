'use client'

import {
    Bus,
    Car,
    Truck,
    Search,
    ChevronDown,
} from 'lucide-react'

import { useState } from 'react'
import { useEffect } from 'react'
import { motion } from "motion/react"


type Props = {
    vehicles: any[]
    selectedVehicle: any
    setSelectedVehicle: (vehicle: any) => void
}

export default function VehicleSidebar({
    vehicles,
    selectedVehicle,
    setSelectedVehicle
}: Props) {


    const [search, setSearch] = useState("")
    const [selectedType, setSelectedType] = useState("All Types")

    function getVehicleIcon(type: string) {
        switch (type) {
            case "Bus":
                return Bus

            case "Taxi":
                return Car

            case "Van":
                return Truck

            case "Auto":
                return Car

            default:
                return Bus
        }
    }

    const filteredVehicles = vehicles.filter((vehicle) => {

        const matchesSearch =
            vehicle.id.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.type.toLowerCase().includes(search.toLowerCase())

        const matchesType =
            selectedType === "All Types" ||
            vehicle.type === selectedType

        return matchesSearch && matchesType
    })

    useEffect(() => {
        if (
            filteredVehicles.length > 0 &&
            !filteredVehicles.some(
                v => v.id === selectedVehicle?.id
            )
        ) {
            setSelectedVehicle(filteredVehicles[0])
        }
    }, [filteredVehicles])

    return (
        <div className="w-full h-full">
            <motion.div
                initial={{ x: -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    duration: 0.9,
                    ease: "easeOut"
                }}
                className="flex flex-col  text-white font-sans h-full rounded-2xl"
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
                        <h2 className="text-lg sm:text-xl font-bold">
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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

                    <div className="relative">
                        <select
                            value={selectedType}
                            onChange={(e) =>
                                setSelectedType(e.target.value)
                            }
                            className="
                                w-full
                                appearance-none
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                            "
                        >
                            <option>All Types</option>
                            <option>Bus</option>
                            <option>Taxi</option>
                            <option>Van</option>
                            <option>Auto</option>
                            <option>Truck</option>
                        </select>

                        <ChevronDown
                            size={18}
                            className="
                                pointer-events-none
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                "
                        />
                    </div>

                </div>

                {/* Bottom Section */}
                <div
                    className="
                    flex-1
                    min-h-0
                    flex
                    flex-col
                    rounded-2xl
                    flex-1
                    overflow-y-auto
                    scrollbar-hide
                    overflow-hidden
                    border
                    border-blue-500/10
                    bg-gradient-to-b
                    from-[#0b1730]
                    via-[#0a1b38]
                    to-[#081426]
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

                        {filteredVehicles.map((vehicle, index) => {
                            const Icon = getVehicleIcon(vehicle.type)

                            return (
                                <motion.div
                                    key={vehicle.id}
                                    onClick={() => {
                                        setSelectedVehicle(vehicle)
                                    }}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
duration:.25,
delay:index*0.04
}}
                                    whileHover={{
                                        y: -2,
                                        scale: 1.01,
                                    }}
                                    className={`
                                        cursor-pointer
                                        rounded-2xl
                                        border
                                        p-4
                                        transition-all

                                        ${(selectedVehicle.id === vehicle.id)
                                            ? 'border-blue-500 bg-slate-900 ring-2 ring-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,.25)]'
                                            : 'border-slate-800 bg-[#071427] shadow-[0_0_25px_rgba(59,130,246,.15)]'
                                        }

                                        hover:border-blue-500/20
                                            transition-all
                                            duration-300
                                    `}
                                >
                                    <div
                                        className="
                                        flex
                                        flex-col
                                        sm:flex-row
                                        sm:items-start
                                        justify-between
                                        gap-3
                                        "
                                    >

                                        <div
                                            className="
                                            flex
                                            items-start
                                            gap-3
                                            min-w-0
                                            "
                                        >
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ${vehicle.color}`}
                                            >
                                                <Icon size={26} />
                                            </div>

                                            <div>
                                                <h3
                                                    className="
                                                        font-semibold
                                                        truncate
                                                        max-w-[140px]
                                                        sm:max-w-none
                                                        "
                                                >
                                                    {vehicle.id}
                                                </h3>

                                                <p
                                                    className="
                                                        text-xs
                                                        sm:text-sm
                                                        text-slate-400
                                                        break-words
                                                        "
                                                >
                                                    {vehicle.type} • {vehicle.model}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className="
                                                self-start
                                                rounded-full
                                                bg-green-500/20
                                                px-2 sm:px-3
                                                py-1
                                                text-[10px]
                                                sm:text-xs
                                                text-green-400
                                                "
                                        >
                                            {vehicle.status}
                                        </span>

                                    </div>

                                    <div
                                        className="
                                            mt-4
                                            grid
                                            grid-cols-2
                                            gap-4
                                            text-xs
                                            sm:text-sm
                                            "
                                    >

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

        </div>
    )
}