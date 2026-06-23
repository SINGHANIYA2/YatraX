'use client'

import { Search } from 'lucide-react'

interface Props {
    search: string
    setSearch: (value: string) => void

    status: string
    setStatus: (value: string) => void
}

export default function ApplicationFilters({
    search,
    setSearch,
    status,
    setStatus
}: Props) {
    return (
        <div
            className="
            mt-6
            p-4
            rounded-3xl
            bg-[#071427]
            border
            border-blue-500/10
            flex
            gap-4
        "
        >

            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
                className="
                w-56
                rounded-xl
                bg-slate-900
                border
                outline-none
                border-slate-800
                px-4
                text-white
                "
            >
                <option>All</option>
                <option>pending</option>
                <option>approved</option>
                <option>rejected</option>
            </select>

            <div className="relative flex-1">
                <Search
                    size={18}
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
                    placeholder="Search applicant..."
                    className="
                    w-full
                    rounded-xl
                    bg-slate-900
                    border
                    border-slate-800
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    text-white
                    "
                />
            </div>

        </div>
    )
}