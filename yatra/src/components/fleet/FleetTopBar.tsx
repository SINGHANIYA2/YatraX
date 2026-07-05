'use client'

export default function FleetTopBar() {
    return (
        <div className="font-sans flex sticky top-0 z-50 h-[72px] px-4 sm:px-6 items-center justify-between bg-card border-b border-border shadow-sm">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                    Fleet Management
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Manage and monitor your entire fleet
                </p>
            </div>
        </div>
    )
}

