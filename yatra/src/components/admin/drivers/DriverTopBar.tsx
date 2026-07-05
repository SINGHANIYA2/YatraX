'use client'

export default function DriverManagementTopBar() {
    return (
        <div className="font-sans flex sticky top-0 z-50 h-[72px] px-4 sm:px-6 items-center justify-between bg-card border-b border-border shadow-sm">

            {/* Left */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    Drivers Management
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground">
                    Manage and monitor all drivers
                </p>
            </div>


        </div>
    )
}