'use client'

import { Search, ChevronDown, Plus } from 'lucide-react'

type Props = {
    selectedType: string
    setSelectedType: React.Dispatch<React.SetStateAction<string>>
    selectedStatus: string
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    onAddVehicle: () => void
}

// Keep these in sync with the `vehicleType` enum on the Vehicle model.
const VEHICLE_TYPES = [
    { value: 'bike', label: 'Bike' },
    { value: 'auto', label: 'Auto' },
    { value: 'cab', label: 'Cab' },
    { value: 'bus', label: 'Bus' },
]

// Keep these in sync with the `status` enum on the Vehicle model.
const VEHICLE_STATUSES = [
    { value: 'available', label: 'Available' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'maintenance', label: 'Maintenance' },
]

export default function FleetFilters({
    selectedType, setSelectedType,
    selectedStatus, setSelectedStatus,
    search, setSearch,
    onAddVehicle
}: Props) {
    return (
        <div className="rounded-2xl border border-primary/10 bg-card p-4 mt-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                {/* Row 1 on mobile: two selects side by side */}
                <div className="flex gap-3 flex-1">
                    {/* Vehicle Type */}
                    <div className="relative flex-1 sm:flex-none sm:w-44">
                        <select
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
                        >
                            <option value="all">All Types</option>
                            {VEHICLE_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Status */}
                    <div className="relative flex-1 sm:flex-none sm:w-44">
                        <select
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
                        >
                            <option value="all">All Status</option>
                            {VEHICLE_STATUSES.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {/* Row 2 on mobile: search + add button */}
                <div className="flex gap-3 flex-1">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            placeholder="Search vehicle..."
                            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none"
                        />
                    </div>

                    {/* Add Vehicle */}
                    <button
                        onClick={onAddVehicle}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap"
                    >
                        <Plus size={16} />
                        <span className="hidden xs:inline">Add Vehicle</span>
                        <span className="xs:hidden">Add</span>
                    </button>
                </div>

            </div>
        </div>
    )
}
