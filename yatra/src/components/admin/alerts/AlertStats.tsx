'use client'

import {
    Bell,
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
} from 'lucide-react'

import AlertStatCard from './AlertStatCard'
import { alertStats } from './demo'

export default function AlertStats() {

    const icons = [
        <Bell size={22} />,
        <ShieldAlert size={22} />,
        <AlertTriangle size={22} />,
        <CheckCircle2 size={22} />,
    ]

    const colors = [
        'text-primary',
        'text-destructive',
        'text-warning',
        'text-success',
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
            {alertStats.map((item, index) => (
                <AlertStatCard
                    key={item.title}
                    title={item.title}
                    value={item.value}
                    icon={icons[index]}
                    iconColor={colors[index]}
                />
            ))}
        </div>
    )
}