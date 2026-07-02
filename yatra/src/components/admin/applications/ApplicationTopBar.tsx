'use client'

export default function ApplicationsTopBar() {
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
                    Applications
                </h1>

                <p className="text-sm text-muted-foreground">
                    Review and manage partner applications
                </p>
            </div>
        </div>
    )
}