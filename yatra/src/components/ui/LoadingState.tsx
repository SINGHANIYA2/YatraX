type Props = {
    label?: string
    fullScreen?: boolean
    className?: string
}

/**
 * Consistent loading indicator for every admin page/section.
 * Uses the theme's `primary` color so it looks the same everywhere
 * (Dashboard, Fleet, Drivers, Applications, Revenue, Settings, etc.)
 * instead of each page hardcoding its own spinner color.
 */
export default function LoadingState({
    label = 'Loading...',
    fullScreen = false,
    className = '',
}: Props) {
    return (
        <div
            className={`
            flex flex-col items-center justify-center gap-3
            ${fullScreen ? 'min-h-screen bg-background text-foreground' : 'py-24'}
            ${className}
            `}
        >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}
