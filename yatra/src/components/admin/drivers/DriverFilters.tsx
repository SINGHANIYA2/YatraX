'use client'

import { Search, ChevronDown } from 'lucide-react'

type Props = {
    selectedStatus: string
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>

    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function DriverFilters({
    selectedStatus,
    setSelectedStatus,

    search,
    setSearch,
}: Props) {

    return (
        <div
            className="
            mt-4
            rounded-2xl
            border
            border-primary/10
            bg-card
            p-4
            shadow-sm
            "
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

                {/* Status Filter */}
                <div className="relative w-full sm:w-52">

                    <select
                        value={selectedStatus}
                        onChange={(e) =>
                            setSelectedStatus(e.target.value)
                        }
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
                        <option value="All Status">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        "
                    />
                </div>

                {/* Search */}
                <div className="relative flex-1">

                    <Search
                        size={16}
                        className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        "
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        type="text"
                        placeholder="Search driver..."
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
            </div>
        </div>
    )
}
