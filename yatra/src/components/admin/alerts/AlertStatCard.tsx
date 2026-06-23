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
            border-blue-500/10
            bg-[#071427]
            p-5
            shadow-[0_0_25px_rgba(59,130,246,.06)]
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
                bg-slate-800/50
                "
            >
                <div className={iconColor}>
                    {icon}
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-4xl font-bold text-white">
                    {value}
                </h2>

                <p className="mt-2 text-slate-400">
                    {title}
                </p>
            </div>
        </div>
    )
}