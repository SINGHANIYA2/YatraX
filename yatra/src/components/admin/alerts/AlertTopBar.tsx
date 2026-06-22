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

            bg-[#071427]
            border-b
            border-blue-500/10

            shadow-[0_4px_20px_rgba(0,0,0,0.25)]
            "
        >
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Alerts Management
                </h1>

                <p className="text-sm text-slate-400">
                    Monitor fleet alerts and incidents
                </p>
            </div>
        </div>
    )
}