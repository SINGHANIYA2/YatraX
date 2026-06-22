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
            border-blue-500/10
            bg-[#071427]
            p-5
            shadow-[0_0_25px_rgba(59,130,246,.06)]
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
                    bg-slate-800/50
                    "
                >
                    <div className={iconColor}>
                        {icon}
                    </div>
                </div>

                <span
                    className="
                    rounded-full
                    bg-green-500/10
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-green-400
                    "
                >
                    {change}
                </span>

            </div>

            <div className="mt-6">

                <h3
                    className="
                    text-sm
                    text-slate-400
                    "
                >
                    {title}
                </h3>

                <p
                    className="
                    mt-2
                    text-4xl
                    font-bold
                    text-white
                    "
                >
                    {value}
                </p>

            </div>
        </div>
    )
}