'use client'

import { LucideIcon } from 'lucide-react'

type Props = {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
}

export default function DriverStatsCard({
    title,
    value,
    icon: Icon,
    color,
}: Props) {
    return (
        <div
            className="
            rounded-2xl
            border
            border-primary/10
            bg-card
            p-5
            shadow-sm
            "
        >
            <div className="flex items-start justify-between">

                <div
                    className={`
                    flex
                    h-9
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-card
                    ${color}
                    `}
                >
                    <Icon size={22} />
                </div>

            </div>

            <div className="mt-5">

                <h2
                    className="
                    text-3xl
                    font-bold
                    text-foreground
                    "
                >
                    {value}
                </h2>

                <p
                    className="
                    mt-2
                    text-sm
                    text-muted-foreground
                    "
                >
                    {title}
                </p>

            </div>
        </div>
    )
}