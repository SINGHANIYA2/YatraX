'use client'

import { Search, ChevronDown, Plus } from 'lucide-react'

type Props = {
    partners: any[]
    setPartners: React.Dispatch<React.SetStateAction<any[]>>

    selectedStatus: string
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>

    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function DriverFilters({
    partners,
    setPartners,

    selectedStatus,
    setSelectedStatus,

    search,
    setSearch,
}: Props) {

    function handleAddDriver() {

        const newDriver = {
            id: crypto.randomUUID(),

            name: 'New Driver',
            vehicle: 'Not Assigned',

            phone: '+91 9876543210',

            rating: 4.5,

            status: 'Off Duty',

            experience: '1 Year',

            trips: 0,
        }

        setPartners(prev => [...prev, newDriver])
    }

    return (
        <div
            className="
            mt-4
            rounded-2xl
            border
            border-blue-500/10
            bg-[#0b1220]
            p-4
            shadow-[0_0_15px_rgba(59,130,246,0.08)]
            "
        >
            <div className="flex items-center gap-4">

                {/* Status Filter */}
                <div className="relative w-52">

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
                        border-slate-700
                        bg-slate-900
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        "
                    >
                        <option>All Status</option>
                        <option>On Duty</option>
                        <option>Off Duty</option>
                    </select>

                    <ChevronDown
                        size={18}
                        className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
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
                        text-slate-500
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
                        border-slate-700
                        bg-slate-900
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        "
                    />
                </div>
            </div>
        </div>
    )
}