'use client'

import { Search, ChevronDown, Plus } from 'lucide-react'


type Props = {
    vehicles: any[]
    setVehicles: React.Dispatch<React.SetStateAction<any[]>>

    selectedType: string
    setSelectedType: React.Dispatch<React.SetStateAction<string>>

    selectedStatus: string
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>

    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function FleetFilters({
    vehicles,
    setVehicles,

    selectedType,
    setSelectedType,

    selectedStatus,
    setSelectedStatus,

    search,
    setSearch
}: Props) {

    function handleAddVehicle() {

        const newVehicle = {
            id: crypto.randomUUID(),
            type: 'Bus',
            driver: 'New Driver',
            route: 'Delhi → Jaipur',
            status: 'Active',
            updated: 'Just now',
            fuelUsed: [0, 0, 0, 0, 0, 0],
            revenue: [0, 0, 0, 0, 0, 0],
            activeDays: 0,
        }

        setVehicles(prev => [...prev, newVehicle])
    }

    return (
        <div
            className="
            rounded-2xl
            border
            border-primary/10
            bg-card
            p-4
            mt-5
            shadow-sm
            "
        >
            <div className="flex items-center gap-4">

                {/* Vehicle Type */}
                <div className="relative w-52">
                    <select
                        value={selectedType}
                        onChange={(e) => {
                            setSelectedType(e.target.value)
                        }}
                        className="
                        w-full
                            appearance-none
                            rounded-xl
                            border
                            border-border
                            bg-card
                            px-4
                            py-3
                            text-sm
                            text-foreground
                            outline-none
                        "
                    >
                        <option>All Types</option>
                        <option>Bus</option>
                        <option>Taxi</option>
                        <option>Van</option>
                        <option>Truck</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                </div>

                {/* Status */}
                <div className="relative w-52">
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value)
                        }}
                        className="
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-border
                        bg-card
                        px-4
                        py-3
                        text-sm
                        text-foreground
                        outline-none
                        "
                    >
                        <option>All Status</option>
                        <option>Active</option>
                        <option>In Transit</option>
                        <option>Maintenance</option>
                        <option>Offline</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                </div>

                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        type="text"
                        placeholder="Search vehicle..."
                        className="
                        w-full
                        rounded-xl
                        border
                        border-border
                        bg-card
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-foreground
                        outline-none
                        "
                    />
                </div>

                {/* Add Vehicle */}
                <button
                    onClick={handleAddVehicle}
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-foreground
                    transition
                    hover:bg-primary
                    "
                >
                    <Plus size={18} />
                    Add Vehicle
                </button>

            </div>
        </div>
    )
}