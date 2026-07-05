'use client'

type StatCardProps = {
    title: string
    value: number
    icon: any
    color: string
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: StatCardProps) {
    return (
        <div
            className="
            rounded-2xl
            border
            border-primary/10
            bg-card
            p-5
            "
        >
            <div className="flex items-center justify-between">

                <div
                    className={`
                    flex h-12 w-12 items-center justify-center
                    rounded-xl bg-card
                    ${color}
                    `}
                >
                    <Icon size={24} />
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-foreground">
                        {value}
                    </h2>
                </div>

            </div>
        </div>
    )
}