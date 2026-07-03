'use client'

import {
    Bus,
    Truck,
    Wrench,
    WifiOff,
    Activity
} from 'lucide-react'

import StatCard from './StatCard'

type Vehicle = {
    status: string
}

export default function FleetStats({
    vehicles
}: {
    vehicles: Vehicle[]
}) {

    function countByStatus(status: string) {
        return vehicles.filter(
            vehicle => vehicle.status === status
        ).length
    }

    return (
        <div className="grid grid-cols-4 gap-4">

            <StatCard
                title="Total Vehicles"
                value={vehicles.length}
                icon={Bus}
                color="text-blue-400"
            />

            <StatCard
                title="Available"
                value={countByStatus("available")}
                icon={Activity}
                color="text-green-400"
            />

            <StatCard
                title="Assigned"
                value={countByStatus("assigned")}
                icon={Truck}
                color="text-orange-400"
            />

            <StatCard
                title="Maintenance"
                value={countByStatus("maintenance")}
                icon={Wrench}
                color="text-yellow-400"
            />

            {/* <StatCard
                title="Offline"
                value={countByStatus("Offline")}
                icon={WifiOff}
                color="text-red-400"
            /> */}

        </div>
    )
}