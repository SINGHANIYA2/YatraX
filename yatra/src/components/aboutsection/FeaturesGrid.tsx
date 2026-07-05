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
        color: 'text-primary'
    },
    {
        title: 'Smart Booking',
        description:
            'Book tickets quickly and securely.',
        icon: Ticket,
        color: 'text-primary'
    },
    {
        title: 'Fleet Optimization',
        description:
            'Optimize routes and vehicle utilization.',
        icon: Bell,
        color: 'text-warning'
    },
    {
        title: 'Secure & Reliable',
        description:
            'Built with modern security practices.',
        icon: ShieldCheck,
        color: 'text-success'
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
                        border-primary/10
                        bg-card
                        p-5
                        shadow-sm
                        transition-all
                        hover:border-primary/30
                        "
                    >
                        <Icon
                            size={24}
                            className={`${feature.color} mb-4`}
                        />

                        <h3 className="text-foreground font-semibold">
                            {feature.title}
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground leading-6">
                            {feature.description}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}