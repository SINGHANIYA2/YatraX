'use client'

import AdminTopbar from './DashboardTopbar'

import {
    Bus,
    Users,
    IndianRupee,
    TriangleAlert,
} from 'lucide-react'

import StatCard from './StatCard'

const stats = [
    {
        title: 'Active Vehicles',
        value: 102,
        icon: Bus,
        color: 'text-blue-400',
    },

    {
        title: 'Drivers On Duty',
        value: 86,
        icon: Users,
        color: 'text-green-400',
    },

    {
        title: 'Revenue Today',
        value: '₹3.4L',
        icon: IndianRupee,
        color: 'text-yellow-400',
    },

    {
        title: 'Pending Requests',
        value: 5,
        icon: TriangleAlert,
        color: 'text-red-400',
    },
]

export default function DashboardStats() {
    return (


        <div className="flex justify-between pt-6 px-6 h-full gap-4">

            {stats.map((stat) => (
                <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                />
            ))}

        </div>
    )
}