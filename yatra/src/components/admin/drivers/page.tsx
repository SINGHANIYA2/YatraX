'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'

import DriverStats from './DriverStats'
import DriverFilters from './DriverFilters'
import DriverTable from './DriverTable'
import DriverManagementTopBar from './DriverTopBar'
import { getDriverStatus } from './lib'
import LoadingState from '@/components/ui/LoadingState'

export default function DriversPage() {

    const [partners, setPartners] =
        useState<any[]>([])

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
                    getDriverStatus(partner) === selectedStatus.toLowerCase()
            )
        }

        if (search.trim()) {
            const query = search.toLowerCase()

            filtered = filtered.filter(partner => {
                const vehicle = partner.assignedVehicleId

                return (
                    partner.name?.toLowerCase().includes(query) ||
                    partner._id?.toLowerCase().includes(query) ||
                    partner.phone?.toLowerCase().includes(query) ||
                    vehicle?.vehicleNumber?.toLowerCase().includes(query) ||
                    vehicle?.vehicleType?.toLowerCase().includes(query)
                )
            })
        }

        return filtered

    }, [
        partners,
        selectedStatus,
        search
    ])

    return (

        <div className='bg-background min-h-screen'>
            {/* Desktop — fixed, matches AdminTopbar behavior */}
            <div className="hidden md:block w-full fixed top-0 z-40">
                <DriverManagementTopBar />
            </div>

            {/* Mobile — normal flow, sits below AdminLayout's own topbar instead of over it */}
            <div className="md:hidden">
                <DriverManagementTopBar />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className=''
            >

                <div className="bg-background px-4 pt-4 sm:px-6 md:pt-6 md:mt-[72px] font-sans">

                    {loading ? (
                        <LoadingState label="Loading drivers..." />
                    ) : error ? (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </p>
                    ) : (
                        <>
                            {/* Stats reflect the full, unfiltered driver list */}
                            <DriverStats
                                partners={partners}
                            />

                            {/* Filters */}
                            <DriverFilters
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

                            {filteredPartners.length === 0 && (
                                <p className="mt-4 text-center text-sm text-muted-foreground">
                                    No drivers match the current filters.
                                </p>
                            )}
                        </>
                    )}

                </div>

            </motion.div>
        </div>
    )
}
