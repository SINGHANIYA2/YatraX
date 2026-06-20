'use client'

import {
    Bus,
    Car,
    Truck,
    Search,
    ChevronDown,
} from 'lucide-react'

const vehicles = [
    {
        id: 'JH01AB1234',
        type: 'Bus',
        model: 'Volvo AC Sleeper',
        speed: 58,
        eta: 32,
        status: 'Live',
        icon: Bus,
        color: 'text-blue-400',
    },
    {
        id: 'JH01CT4567',
        type: 'Taxi',
        model: 'Sedan',
        speed: 45,
        eta: 28,
        status: 'Live',
        icon: Car,
        color: 'text-yellow-400',
    },
    {
        id: 'JH01MN7890',
        type: 'Van',
        model: 'Tempo Traveller',
        speed: 50,
        eta: 35,
        status: 'Live',
        icon: Truck,
        color: 'text-green-400',
    },
    {
        id: 'JH01RT2345',
        type: 'Auto',
        model: 'Auto Rickshaw',
        speed: 40,
        eta: 20,
        status: 'Live',
        icon: Car,
        color: 'text-orange-400',
    },
    {
        id: 'JH01AB5678',
        type: 'Bus',
        model: 'Volvo AC Sleeper',
        speed: 60,
        eta: 30,
        status: 'Live',
        icon: Bus,
        color: 'text-blue-400',
    },
]

export default function VehicleSidebar() {
    return (
        <div className="h-full rounded-2xl border
            shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/10
             bg-[#071427] p-4 text-white">

            {/* Header */}
            <div className="mb-5 flex items-center gap-2">
                <h2 className="text-xl font-bold">
                    Live Vehicles
                </h2>

                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="text-sm text-slate-400">
                    18 Vehicles Online
                </span>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                    placeholder="Search vehicle..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                />
            </div>

            {/* Filter */}
            <button className="mb-5 flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <span className="text-sm">
                    All Types
                </span>

                <ChevronDown size={18} />
            </button>

            {/* Vehicles */}
            <div className="space-y-4">

                {vehicles.map((vehicle, index) => {
                    const Icon = vehicle.icon

                    return (
                        <div
                            key={vehicle.id}
                            className={`cursor-pointer rounded-2xl border p-4 transition-all hover:border-blue-500 hover:bg-slate-900
                                
                                ${index === 0
                                    ? 'border-blue-500 bg-slate-900'
                                    : 'border-slate-800'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between">

                                <div className="flex gap-3">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ${vehicle.color}`}
                                    >
                                        <Icon size={26} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            {vehicle.id}
                                        </h3>

                                        <p className="text-sm text-slate-400">
                                            {vehicle.type} • {vehicle.model}
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                                    {vehicle.status}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm">

                                <div>
                                    <p className="text-slate-500">
                                        Speed
                                    </p>

                                    <p>
                                        {vehicle.speed} km/h
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-500">
                                        ETA
                                    </p>

                                    <p>
                                        {vehicle.eta} min
                                    </p>
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Button */}
            <button className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-900 py-3 font-medium transition hover:border-blue-500">
                View All Vehicles
            </button>
        </div>
    )
}