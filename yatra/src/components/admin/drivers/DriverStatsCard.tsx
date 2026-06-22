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
            border-blue-500/10
            bg-[#0b1220]
            p-5
            shadow-[0_0_15px_rgba(59,130,246,0.08)]
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
                    bg-slate-900
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
                    text-white
                    "
                >
                    {value}
                </h2>

                <p
                    className="
                    mt-2
                    text-sm
                    text-slate-400
                    "
                >
                    {title}
                </p>

            </div>
        </div>
    )
}