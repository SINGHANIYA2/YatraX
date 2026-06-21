'use client'
import { motion } from "motion/react"
import VehicleSidebar from "./VehicleSidebar"
import LiveMap from "./LiveMap"
import VehicleDetails from "./VehicleDetails"


export default function LiveTracking() {
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
                <div className="w-[36%] h-full">
                    <VehicleSidebar />
                </div>


                {/* Center */}
                <div className="w-[44%] h-full">
                    <LiveMap />
                </div>

                {/* Right */}
                <div className="w-[20%] h-full">
                    <VehicleDetails />
                </div>


            </motion.div>
        </div>
    )
}