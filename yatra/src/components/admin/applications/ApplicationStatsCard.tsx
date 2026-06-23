import { LucideIcon } from 'lucide-react'

interface Props {
    title: string
    value: number
    icon: LucideIcon
    iconColor: string
}

export default function ApplicationStatsCard({
    title,
    value,
    icon: Icon,
    iconColor
}: Props) {
    return (
        <div
            className="
            bg-[#071427]
            border
            border-blue-500/10
            rounded-3xl
            p-6
        "
        >
            <div
                className="
                h-12
                w-12
                rounded-xl
                bg-slate-900
                flex
                items-center
                justify-center
            "
            >
                <Icon
                    size={22}
                    className={iconColor}
                />
            </div>

            <h2 className="mt-5 text-4xl font-bold text-white">
                {value}
            </h2>

            <p className="mt-2 text-slate-400">
                {title}
            </p>
        </div>
    )
}