'use client'

import {
    Bell,
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
} from 'lucide-react'

import AlertStatCard from './AlertStatCard'
import type { AlertStatsData } from '../../../../src/app/admin/alerts/page'

export default function AlertStats({
    stats,
    loading,
}: {
    stats: AlertStatsData
    loading: boolean
}) {

    const cards = [
        { title: 'Total Alerts', value: stats.total, icon: <Bell size={22} />, color: 'text-primary' },
        { title: 'Critical', value: stats.critical, icon: <ShieldAlert size={22} />, color: 'text-destructive' },
        { title: 'Warning', value: stats.warning, icon: <AlertTriangle size={22} />, color: 'text-warning' },
        { title: 'Resolved', value: stats.resolved, icon: <CheckCircle2 size={22} />, color: 'text-success' },
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
            {cards.map((item) => (
                <AlertStatCard
                    key={item.title}
                    title={item.title}
                    value={loading ? 0 : item.value}
                    icon={item.icon}
                    iconColor={item.color}
                />
            ))}
        </div>
    )
}
