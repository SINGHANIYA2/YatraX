'use client'

import { Bus, Truck, Wrench, Activity } from 'lucide-react'
import StatCard from './StatCard'

type Vehicle = { status: string }

export default function FleetStats({ vehicles }: { vehicles: Vehicle[] }) {
    function countByStatus(status: string) {
        return vehicles.filter(v => v.status === status).length
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <StatCard title="Total Vehicles" value={vehicles.length} icon={Bus} color="text-primary" />
            <StatCard title="Available" value={countByStatus('available')} icon={Activity} color="text-success" />
            <StatCard title="Assigned" value={countByStatus('assigned')} icon={Truck} color="text-warning" />
            <StatCard title="Maintenance" value={countByStatus('maintenance')} icon={Wrench} color="text-warning" />
        </div>
    )
}

