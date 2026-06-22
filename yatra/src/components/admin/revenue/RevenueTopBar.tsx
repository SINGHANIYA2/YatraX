'use client'

export default function RevenueTopBar() {
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
            border-b border-slate-800
            shadow-[0_4px_20px_rgba(0,0,0,0.25)]

            border-b
            border-blue-500/10
            "
        >

            {/* Left */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Revenue Management
                </h1>

                <p className="text-sm text-slate-400">
                    Monitor earnings and business performance
                </p>
            </div>


        </div>
    )
}