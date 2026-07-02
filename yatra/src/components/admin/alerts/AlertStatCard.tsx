'use client'

import { ReactNode } from 'react'

type Props = {
    title: string
    value: number
    icon: ReactNode
    iconColor: string
}

export default function AlertStatCard({
    title,
    value,
    icon,
    iconColor,
}: Props) {
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

            <div className="mt-6">
                <h2 className="text-4xl font-bold text-foreground">
                    {value}
                </h2>

                <p className="mt-2 text-muted-foreground">
                    {title}
                </p>
            </div>
        </div>
    )
}