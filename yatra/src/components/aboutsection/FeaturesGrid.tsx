'use client'

import {
    Route,
    Ticket,
    Bell,
    ShieldCheck
} from 'lucide-react'

const features = [
    {
        title: 'Real-Time Tracking',
        description:
            'Track vehicles live with accurate ETA updates.',
        icon: Route,
        color: 'text-blue-400'
    },
    {
        title: 'Smart Booking',
        description:
            'Book tickets quickly and securely.',
        icon: Ticket,
        color: 'text-cyan-400'
    },
    {
        title: 'Fleet Optimization',
        description:
            'Optimize routes and vehicle utilization.',
        icon: Bell,
        color: 'text-yellow-400'
    },
    {
        title: 'Secure & Reliable',
        description:
            'Built with modern security practices.',
        icon: ShieldCheck,
        color: 'text-green-400'
    }
]

export default function FeaturesGrid() {
    return (
        <div className="grid grid-cols-4 gap-4">

            {features.map((feature) => {
                const Icon = feature.icon

                return (
                    <div
                        key={feature.title}
                        className="
                        rounded-2xl
                        border
                        border-blue-500/10
                        bg-[#071427]
                        p-5
                        shadow-[0_0_15px_rgba(59,130,246,0.15)]
                        transition-all
                        hover:border-blue-500/30
                        "
                    >
                        <Icon
                            size={24}
                            className={`${feature.color} mb-4`}
                        />

                        <h3 className="text-white font-semibold">
                            {feature.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-400 leading-6">
                            {feature.description}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}