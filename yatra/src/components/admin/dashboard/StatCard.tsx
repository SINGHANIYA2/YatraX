'use client'

import { LucideIcon } from 'lucide-react'

type Props = {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
    loading?: boolean
    onClick?: () => void
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    loading = false,
    onClick,
}: Props) {
    const isInteractive = typeof onClick === 'function'

    return (
        <div
            role={isInteractive ? 'button' : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            onClick={onClick}
            onKeyDown={(e) => {
                if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onClick?.()
                }
            }}
            className={`
            flex
            w-full
            rounded-2xl
            border
            border-primary/10
            bg-card
            p-4
            transition
            sm:rounded-3xl
            sm:p-6
            ${isInteractive ? 'cursor-pointer hover:border-primary/30 hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/40' : ''}
            `}
        >
            <div className="flex w-full items-start justify-between gap-3">

                <div
                    className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-card
                    sm:h-12
                    sm:w-12
                    ${color}
                    `}
                >
                    <Icon size={18} className="sm:hidden" />
                    <Icon size={22} className="hidden sm:block" />
                </div>

                <div className="flex flex-col items-end gap-2 text-right sm:gap-5">
                    <p className="text-xs text-muted-foreground sm:text-sm">
                        {title}
                    </p>

                    {loading ? (
                        <div className="h-6 w-14 animate-pulse rounded bg-muted sm:h-8 sm:w-20" />
                    ) : (
                        <h2 className="text-xl font-bold text-foreground sm:text-3xl">
                            {value}
                        </h2>
                    )}
                </div>

            </div>
        </div>
    )
}
