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
        <div className="grid grid-cols-5 gap-4">

            <StatCard
                title="Total Vehicles"
                value={vehicles.length}
                icon={Bus}
                color="text-primary"
            />

            <StatCard
                title="Active"
                value={countByStatus("Active")}
                icon={Activity}
                color="text-success"
            />

            <StatCard
                title="In Transit"
                value={countByStatus("In Transit")}
                icon={Truck}
                color="text-warning"
            />

            <StatCard
                title="Maintenance"
                value={countByStatus("Maintenance")}
                icon={Wrench}
                color="text-warning"
            />

            <StatCard
                title="Offline"
                value={countByStatus("Offline")}
                icon={WifiOff}
                color="text-destructive"
            />

        </div>
    )
}