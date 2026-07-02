'use client'

export default function AlertTopBar() {
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
            border-b
            border-primary/10

            shadow-sm
            "
        >
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Alerts Management
                </h1>

                <p className="text-sm text-muted-foreground">
                    Monitor fleet alerts and incidents
                </p>
            </div>
        </div>
    )
}