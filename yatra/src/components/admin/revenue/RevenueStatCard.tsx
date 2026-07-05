'use client'

import { ReactNode } from 'react'

type RevenueStatCardProps = {
    title: string
    value: string
    change: string
    icon: ReactNode
    iconColor: string
    trend?: 'up' | 'down' | 'flat'
}

export default function RevenueStatCard({
    title,
    value,
    change,
    icon,
    iconColor,
    trend = 'up',
}: RevenueStatCardProps) {
    const badgeClass =
        trend === 'down'
            ? 'bg-destructive/10 text-destructive'
            : trend === 'flat'
            ? 'bg-muted text-muted-foreground'
            : 'bg-success/10 text-success'
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
                    className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium
                    ${badgeClass}
                    `}
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