'use client'

import { motion } from "motion/react"
import { useState } from "react"

import VehicleSidebar from "./VehicleSidebar"
import LiveMap from "./LiveMap"
import VehicleDetails from "./VehicleDetails"
import { trackingVehicles } from "./demo"

export default function LiveTracking() {

    const [vehicles] = useState(trackingVehicles)

    const [selectedVehicle, setSelectedVehicle] =
        useState(trackingVehicles[0])

    return (
        <div className="bg-[#030712] min-h-screen overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="
relative
mt-24

px-4
sm:px-6
lg:px-8

grid
grid-cols-1
xl:grid-cols-[320px_minmax(0,1fr)_300px]

gap-4

min-h-[calc(100vh-110px)]
"
            >

                {/* Glow */}
                <div
                    className="
                    absolute
                    top-0
                    left-0
                    w-[700px]
                    h-[500px]
                    bg-blue-600/10
                    blur-[150px]
                    rounded-full
                    pointer-events-none
                "
                />

                <div
                    className="
                    absolute
                    bottom-0
                    right-0
                    w-[700px]
                    h-[500px]
                    bg-cyan-500/10
                    blur-[150px]
                    rounded-full
                    pointer-events-none
                "
                />

                {/* Sidebar */}
                <div
className="
w-full
xl:w-[320px]
relative
z-10
"
>
                    <VehicleSidebar
                        vehicles={vehicles}
                        selectedVehicle={selectedVehicle}
                        setSelectedVehicle={setSelectedVehicle}
                    />
                </div>

                {/* Map */}
                <div
className="
relative
z-10

h-[350px]
sm:h-[450px]
xl:h-auto

min-w-0
"
>
                    <LiveMap />
                </div>

                {/* Details */}
              <div
className="
w-full
xl:w-[300px]

relative
z-10
"
>
                    <VehicleDetails
                        vehicle={selectedVehicle}
                    />
                </div>

            </motion.div>
        </div>
    )

}
