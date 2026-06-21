'use client'
// import MapView from './MapView'
import dynamic from 'next/dynamic'

const MapView = dynamic(
    () => import('./MapView'),
    { ssr: false }
)

export default function LiveMap() {
    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 self-stretch">
            <MapView />
        </div>
    )
}