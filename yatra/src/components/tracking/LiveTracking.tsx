'use client'
import { motion } from "motion/react"
import { useState } from "react"

import VehicleSidebar from "./VehicleSidebar"
import LiveMap from "./LiveMap"
import VehicleDetails from "./VehicleDetails"
import { trackingVehicles } from './demo'


export default function LiveTracking() {
    const [vehicles, setVehicles] =
        useState(trackingVehicles)

    const [selectedVehicle, setSelectedVehicle] =
        useState(trackingVehicles[0])


    return (


        <div className="bg-[#030712]">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut"
                }}
                className="
                text-white
                font-sans
                text-white
                mx-auto
                mt-30
                px-[40px]
                font-sans
                gap-4
                flex
                h-[calc(100vh-100px)]
                overflow-hidden
                mb-8"
            >
                <div className="absolute top-0 left-0 w-[700px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />

                <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />

                <div className="relative z-10 mx-auto justify-between"></div>

                {/* Left */}
                <VehicleSidebar
                    vehicles={vehicles}
                    selectedVehicle={selectedVehicle}
                    setSelectedVehicle={setSelectedVehicle}
                />


                {/* Center */}
                    <LiveMap />

                {/* Right */}
                <div className="w-[20%] h-full">
                    <VehicleDetails vehicle={selectedVehicle} />
                </div>


            </motion.div>
        </div>
    )
}