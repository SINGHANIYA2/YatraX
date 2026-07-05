'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'motion/react'

import FleetStats from './FleetStats'
import FleetFilters from './FleetFilters'
import FleetTable from './FleetTable'
import FleetTopBar from './FleetTopBar'
import AddVehicleForm from '@/components/AddVehicleForm'
import LoadingState from '@/components/ui/LoadingState'

export default function FleetManagement() {
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedType, setSelectedType] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [search, setSearch] = useState('')
    const [showAddVehicle, setShowAddVehicle] = useState(false)

    const filteredVehicles = useMemo(() => {
        let filtered = vehicles

        if (selectedType !== 'all') {
            filtered = filtered.filter(
                v => v.vehicleType?.toLowerCase() === selectedType
            )
        }
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(
                v => v.status?.toLowerCase() === selectedStatus
            )
        }
        if (search.trim()) {
            const q = search.toLowerCase()
            filtered = filtered.filter(
                v => v.vehicleNumber?.toLowerCase().includes(q) ||
                    v.assignedPartnerId?.name?.toLowerCase().includes(q)
            )
        }
        return filtered
    }, [vehicles, selectedType, selectedStatus, search])

    const fetchVehicles = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch('/api/admin/vehicle')
            const data = await res.json()
            if (data.success) {
                setVehicles(data.vehicles)
            } else {
                setError(data.message ?? 'Failed to load vehicles.')
            }
        } catch (err) {
            console.log(err)
            setError('Failed to load vehicles.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchVehicles() }, [])

    return (
        <div>
            {/* TopBar — fixed on desktop, shown normally on mobile (already handled by AdminLayout) */}
            <div className="hidden md:block w-full fixed top-0 z-40">
                <FleetTopBar />
            </div>
            <div className="md:hidden">
                <FleetTopBar />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-background font-sans px-4 sm:px-6 pt-4 md:pt-6 md:mt-[72px] pb-8"
            >
                {loading ? (
                    <LoadingState label="Loading fleet..." />
                ) : error ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-card p-8 text-center text-sm text-destructive">
                        {error}
                        <button
                            onClick={fetchVehicles}
                            className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <FleetStats vehicles={vehicles} />

                        <FleetFilters
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            search={search}
                            setSearch={setSearch}
                            onAddVehicle={() => setShowAddVehicle(true)}
                        />

                        <FleetTable
                            vehicles={filteredVehicles}
                            setVehicles={setVehicles}
                            fetchVehicles={fetchVehicles}
                        />
                    </>
                )}

                <AddVehicleForm
                    open={showAddVehicle}
                    onClose={() => setShowAddVehicle(false)}
                    onSuccess={() => { fetchVehicles() }}
                />
            </motion.div>
        </div>
    )
}
