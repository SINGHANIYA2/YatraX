import { motion } from "motion/react"
import VehicleSidebar from "./VehicleSidebar"
import LiveMap from "./LiveMap"
import VehicleDetails from "./VehicleDetails"


export default function LiveTracking() {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.6,
                ease: "easeOut"
            }}
            className="mx-auto mt-28 px-[40px] font-sans grid grid-cols-12 gap-4 h-screen"
        >

            {/* Left */}
            <div className="col-span-4">
                <VehicleSidebar />
            </div>

            {/* Center */}
            <div className="col-span-6">
                <LiveMap />
            </div>

            {/* Right */}
            <div className="col-span-3">
                <VehicleDetails />
            </div>


        </motion.div>
    )
}