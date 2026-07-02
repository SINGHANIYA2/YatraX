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
            bg-card
            border
            border-primary/10
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
                bg-card
                border
                outline-none
                border-border
                px-4
                text-foreground
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
                    text-muted-foreground
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
                    bg-card
                    border
                    border-border
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    text-foreground
                    "
                />
            </div>

        </div>
    )
}