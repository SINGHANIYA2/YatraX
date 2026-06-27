'use client'

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

export default function MapView() {

    const route = [
        [23.3441, 85.3096],
        [22.8046, 86.2029],
    ]

    return (
        <MapContainer
            center={[23.1, 85.8]}
            zoom={9}
            className="
                h-full
                w-full
                rounded-2xl
            "
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            />

            <Polyline
                positions={route as any}
                pathOptions={{
                    color: '#2563eb',
                    weight: 4,
                }}
            />

            <Marker position={[23.3441, 85.3096]}>
                <Popup>Ranchi</Popup>
            </Marker>

            <Marker position={[22.8046, 86.2029]}>
                <Popup>Jamshedpur</Popup>
            </Marker>

            <Marker position={[23.05, 85.75]}>
                <Popup>Bus - Live</Popup>
            </Marker>

        </MapContainer>
    )
}