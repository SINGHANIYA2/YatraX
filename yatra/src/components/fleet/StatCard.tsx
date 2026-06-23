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
            border-blue-500/10
            bg-[#071427]
            p-5
            "
        >
            <div className="flex items-center justify-between">

                <div
                    className={`
                    flex h-12 w-12 items-center justify-center
                    rounded-xl bg-slate-900
                    ${color}
                    `}
                >
                    <Icon size={24} />
                </div>

                <div>
                    <p className="text-sm text-slate-400">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                        {value}
                    </h2>
                </div>

            </div>
        </div>
    )
}