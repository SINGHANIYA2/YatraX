'use client'

import dynamic from 'next/dynamic'

const MapView = dynamic(
    () => import('./MapView'),
    { ssr: false }
)

export default function LiveMap() {
    return (
        <div
            className="
                relative
                h-full
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-blue-500/10
                bg-[#071427]
            "
        >
            <MapView />
        </div>
    )
}