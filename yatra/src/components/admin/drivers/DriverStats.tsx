'use client'

import {
    Users,
    UserCheck,
    UserX,
    Star,
} from 'lucide-react'

import DriverStatsCard from './DriverStatsCard'

type Driver = {
    status: string
    rating: number
}

export default function DriverStats({
    drivers,
}: {
    drivers: Driver[]
}) {

    const totalDrivers = drivers.length

    const onDuty = drivers.filter(
        driver => driver.status === 'On Duty'
    ).length

    const offDuty = drivers.filter(
        driver => driver.status === 'Off Duty'
    ).length

    const avgRating =
        drivers.length > 0
            ? (
                drivers.reduce(
                    (sum, driver) =>
                        sum + driver.rating,
                    0
                ) / drivers.length
            ).toFixed(1)
            : '0.0'

    return (
        <div className="grid grid-cols-4 gap-4">

            <DriverStatsCard
                title="Total Drivers"
                value={totalDrivers}
                icon={Users}
                color="text-primary"
            />

            <DriverStatsCard
                title="On Duty"
                value={onDuty}
                icon={UserCheck}
                color="text-success"
            />

            <DriverStatsCard
                title="Off Duty"
                value={offDuty}
                icon={UserX}
                color="text-destructive"
            />

            <DriverStatsCard
                title="Avg Rating"
                value={avgRating}
                icon={Star}
                color="text-warning"
            />

        </div>
    )
}