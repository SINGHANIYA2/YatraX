'use client'

export default function ApplicationsTopBar() {
    return (
        <div className="font-sans flex sticky top-0 z-50 h-[72px] px-4 sm:px-6 items-center justify-between bg-card border-b border-border shadow-sm">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    Applications
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground">
                    Review and manage partner applications
                </p>
            </div>
        </div>
    )
}
