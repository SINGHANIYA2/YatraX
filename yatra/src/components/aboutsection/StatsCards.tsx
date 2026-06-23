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
        color: 'text-blue-400'
    },
    {
        title: 'Daily Trips',
        value: '1,000+',
        icon: Route,
        color: 'text-cyan-400'
    },
    {
        title: 'Fleet Vehicles',
        value: '500+',
        icon: Users,
        color: 'text-green-400'
    },
    {
        title: 'Tracking Accuracy',
        value: '99%',
        icon: ShieldCheck,
        color: 'text-yellow-400'
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
                        border-blue-500/10
                        bg-[#071427]
                        p-5
                        shadow-[0_0_15px_rgba(59,130,246,0.15)]
                        "
                    >
                        <Icon
                            className={`${stat.color} mb-4`}
                            size={24}
                        />

                        <h2 className="text-2xl font-bold text-white">
                            {stat.value}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            {stat.title}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}