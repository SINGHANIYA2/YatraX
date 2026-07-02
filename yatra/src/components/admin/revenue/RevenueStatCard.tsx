'use client'

import { ReactNode } from 'react'

type RevenueStatCardProps = {
    title: string
    value: string
    change: string
    icon: ReactNode
    iconColor: string
}

export default function RevenueStatCard({
    title,
    value,
    change,
    icon,
    iconColor,
}: RevenueStatCardProps) {
    return (
        <div
            className="
            rounded-3xl
            border
            border-primary/10
            bg-card
            p-5
            shadow-sm
            "
        >
            <div className="flex items-start justify-between">

                <div
                    className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-secondary/50
                    "
                >
                    <div className={iconColor}>
                        {icon}
                    </div>
                </div>

                <span
                    className="
                    rounded-full
                    bg-success/10
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-success
                    "
                >
                    {change}
                </span>

            </div>

            <div className="mt-6">

                <h3
                    className="
                    text-sm
                    text-muted-foreground
                    "
                >
                    {title}
                </h3>

                <p
                    className="
                    mt-2
                    text-4xl
                    font-bold
                    text-foreground
                    "
                >
                    {value}
                </p>

            </div>
        </div>
    )
}