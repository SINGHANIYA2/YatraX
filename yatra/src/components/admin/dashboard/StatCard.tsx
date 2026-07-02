'use client'

import { LucideIcon } from 'lucide-react'

type Props = {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: Props) {
    return (
        <div
            className="
            rounded-3xl
            border
            border-primary/10
            bg-card
            p-6
            flex
            w-full
            "
        >
            <div className="flex w-full justify-between">

                <div
                    className={`
                    flex
                    h-12
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

                <div className="text-right gap-5 flex flex-col">
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold text-foreground">
                        {value}
                    </h2>
                </div>

            </div>
        </div>
    )
}