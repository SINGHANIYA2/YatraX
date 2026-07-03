'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'

import DriverStats from './DriverStats'
import DriverFilters from './DriverFilters'
import DriverTable from './DriverTable'
import DriverManagementTopBar from './DriverTopBar'

type Partner = {
    _id: string
    name: string
    vehicle: string
    phone: string
    rating: number
    status: string
    experience: string
    trips: number
}

export default function DriversPage() {

    const [partners, setPartners] =
        useState<Partner[]>([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState<string | null>(null)

    const [selectedStatus, setSelectedStatus] =
        useState('All Status')

    const [search, setSearch] =
        useState('')

    useEffect(() => {
        let cancelled = false

        async function loadDrivers() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch('/api/admin/partner')
                const data = await res.json()

                if (!res.ok || !data.success) {
                    throw new Error(data?.message || 'Could not load partners')
                }

                if (!cancelled) setPartners(data.partners)
            } catch (err: any) {
                if (!cancelled) setError(err?.message || 'Something went wrong')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadDrivers()
        return () => {
            cancelled = true
        }
    }, [])

    const filteredPartners = useMemo(() => {

        let filtered = partners

        if (selectedStatus !== 'All Status') {
            filtered = filtered.filter(
                partner =>
                    partner.status === selectedStatus
            )
        }

        if (search.trim()) {
            filtered = filtered.filter(
                partner =>
                    partner.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    partner._id
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    partner.vehicle
                        .toLowerCase()
                        .includes(search.toLowerCase())
            )
        }

        return filtered

    }, [
        partners,
        selectedStatus,
        search
    ])

    return (

        <div className='bg-[#030712] h-screen'>
            <div className="w-full fixed top-0 z-40">
                <DriverManagementTopBar />
            </div>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className=''
            >

                <div className="bg-[#030712] px-6 pt-6 mt-[100px] font-sans">

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        </div>
                    ) : error ? (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </p>
                    ) : (
                        <>
                            {/* Stats */}
                            <DriverStats
                                partners={filteredPartners}
                            />

                            {/* Filters */}
                            <DriverFilters
                                partners={partners}
                                setPartners={setPartners}

                                selectedStatus={selectedStatus}
                                setSelectedStatus={setSelectedStatus}

                                search={search}
                                setSearch={setSearch}
                            />

                            {/* Table */}
                            <DriverTable
                                partners={filteredPartners}
                                setPartners={setPartners}
                            />
                        </>
                    )}

                </div>

            </motion.div>
        </div>
    )
}