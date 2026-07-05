'use client'

import {
    IndianRupee,
    Wallet,
    TrendingUp,
    Calendar,
} from 'lucide-react'

import RevenueStatCard from './RevenueStatCard'
import { formatINR } from '@/lib/utils'
import type { RevenueStatsData } from './types'

export default function RevenueStats({ stats }: { stats: RevenueStatsData }) {

    const growthTrend: 'up' | 'down' | 'flat' =
        stats.growthRate > 0 ? 'up' : stats.growthRate < 0 ? 'down' : 'flat'

    const cards = [
        {
            title: 'Total Revenue',
            value: formatINR(stats.totalRevenue),
            change: `${stats.totalBookings} bookings`,
            icon: <IndianRupee size={22} />,
            iconColor: 'text-warning',
            trend: 'flat' as const,
        },
        {
            title: "Today's Revenue",
            value: formatINR(stats.todayRevenue),
            change: 'Today',
            icon: <Calendar size={22} />,
            iconColor: 'text-success',
            trend: 'flat' as const,
        },
        {
            title: 'Monthly Revenue',
            value: formatINR(stats.monthlyRevenue),
            change: 'This month',
            icon: <Wallet size={22} />,
            iconColor: 'text-primary',
            trend: 'flat' as const,
        },
        {
            title: 'Growth Rate',
            value: `${stats.growthRate > 0 ? '+' : ''}${stats.growthRate}%`,
            change: growthTrend === 'flat' ? 'No change' : 'vs last month',
            icon: <TrendingUp size={22} />,
            iconColor: 'text-primary',
            trend: growthTrend,
        },
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
            {cards.map((stat) => (
                <RevenueStatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    icon={stat.icon}
                    iconColor={stat.iconColor}
                    trend={stat.trend}
                />
            ))}
        </div>
    )
}
