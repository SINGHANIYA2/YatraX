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
            bg-card
            border
            border-primary/10
            rounded-3xl
            p-6
        "
        >
            <div
                className="
                h-12
                w-12
                rounded-xl
                bg-card
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

            <h2 className="mt-5 text-4xl font-bold text-foreground">
                {value}
            </h2>

            <p className="mt-2 text-muted-foreground">
                {title}
            </p>
        </div>
    )
}