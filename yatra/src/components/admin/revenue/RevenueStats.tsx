'use client'

import {
    IndianRupee,
    Wallet,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react'

import RevenueStatCard from './RevenueStatCard'
import { revenueStats } from './demo'

export default function RevenueStats() {

    const icons = [
        <IndianRupee size={22} />,
        <Wallet size={22} />,
        <TrendingUp size={22} />,
        <ArrowUpRight size={22} />
    ]

    const iconColors = [
        'text-warning',
        'text-success',
        'text-primary',
        'text-primary'
    ]

    return (
        <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-5
            mb-8
            "
        >
            {revenueStats.map((stat, index) => (
                <RevenueStatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    icon={icons[index]}
                    iconColor={iconColors[index]}
                />
            ))}
        </div>
    )
}