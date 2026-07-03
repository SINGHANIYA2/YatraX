'use client'

import {
    Users,
    UserCheck,
    UserX,
    Star,
} from 'lucide-react'

import DriverStatsCard from './DriverStatsCard'

type Partner = {
    status: string
    rating: number
}

export default function DriverStats({
    partners,
}: {
    partners: Partner[]
}) {

    const totalDrivers = partners.length

    const onDuty = partners.filter(
        partner => partner.status === 'available' || partner.status === 'Busy'
    ).length

    const offDuty = partners.filter(
        partner => partner.status === 'busy' || partner.status === 'Offline'
    ).length

    const avgRating =
        partners.length > 0
            ? (
                partners.reduce(
                    (sum, partner) =>
                        sum + partner.rating,
                    0
                ) / partners.length
            ).toFixed(1)
            : '0.0'

    return (
        <div className="grid grid-cols-3 gap-4">

            <DriverStatsCard
                title="Total Drivers"
                value={totalDrivers}
                icon={Users}
                color="text-blue-400"
            />

            <DriverStatsCard
                title="Available Drivers"
                value={onDuty}
                icon={UserCheck}
                color="text-green-400"
            />

            <DriverStatsCard
                title="offline Drivers"
                value={offDuty}
                icon={UserX}
                color="text-red-400"
            />

        </div>
    )
}