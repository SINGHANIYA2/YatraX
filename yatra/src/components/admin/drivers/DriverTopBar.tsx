'use client'

export default function DriverManagementTopBar() {
    return (
        <div
            className="
            sticky
            top-0
            z-50
            h-21
            px-8
            flex
            items-center
            justify-between

            bg-card
            border-b border-border
            shadow-sm

            border-b
            border-primary/10
            "
        >

            {/* Left */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Drivers Management
                </h1>

                <p className="text-sm text-muted-foreground">
                    Manage and monitor all drivers
                </p>
            </div>


        </div>
    )
}