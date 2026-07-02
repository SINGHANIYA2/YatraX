'use client'

import {
    Bus,
    Route,
    Users,
    ShieldCheck
} from 'lucide-react'

const stats = [
    {
        title: 'Trips Completed',
        value: '50,000+',
        icon: Bus,
        color: 'text-primary'
    },
    {
        title: 'Daily Trips',
        value: '1,000+',
        icon: Route,
        color: 'text-primary'
    },
    {
        title: 'Fleet Vehicles',
        value: '500+',
        icon: Users,
        color: 'text-success'
    },
    {
        title: 'Tracking Accuracy',
        value: '99%',
        icon: ShieldCheck,
        color: 'text-warning'
    }
]

export default function StatsCards() {
    return (
        <div className="grid grid-cols-2 gap-4">

            {stats.map((stat) => {
                const Icon = stat.icon

                return (
                    <div
                        key={stat.title}
                        className="
                        rounded-2xl
                        border
                        border-primary/10
                        bg-card
                        p-5
                        shadow-sm
                        "
                    >
                        <Icon
                            className={`${stat.color} mb-4`}
                            size={24}
                        />

                        <h2 className="text-2xl font-bold text-foreground">
                            {stat.value}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {stat.title}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}