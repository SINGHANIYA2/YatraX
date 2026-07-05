'use client'

import {
    Users,
    UserCheck,
    UserX,
} from 'lucide-react'

import DriverStatsCard from './DriverStatsCard'
import { getDriverStatus } from './lib'

type Partner = {
    isOnline?: boolean
    assignedVehicleId?: { status?: string } | null
}

export default function DriverStats({
    partners,
}: {
    partners: Partner[]
}) {

    const totalDrivers = partners.length

    const availableDrivers = partners.filter(
        partner => getDriverStatus(partner) === 'available'
    ).length

    const offlineDrivers = partners.filter(
        partner => !partner.isOnline
    ).length

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <DriverStatsCard
                title="Total Drivers"
                value={totalDrivers}
                icon={Users}
                color="text-primary"
            />

            <DriverStatsCard
                title="Available Drivers"
                value={availableDrivers}
                icon={UserCheck}
                color="text-success"
            />

            <DriverStatsCard
                title="Offline Drivers"
                value={offlineDrivers}
                icon={UserX}
                color="text-destructive"
            />

        </div>
    )
}
