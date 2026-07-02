'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'

import FleetStats from './FleetStats'
import FleetFilters from './FleetFilters'
import FleetTable from './FleetTable'
import FleetAnalytics from './FleetAnalytics'
import FleetTopBar from './FleetTopBar'

import { fleetVehicles } from './demo'

export default function FleetManagement() {

    const [vehicles, setVehicles] =
        useState(fleetVehicles)

    const [selectedType, setSelectedType] =
        useState('All Types')

    const [selectedStatus, setSelectedStatus] =
        useState('All Status')

    const [search, setSearch] =
        useState('')

    function applyFilters() {

        let filtered = vehicles

        if (selectedType !== 'All Types') {
            filtered = filtered.filter(
                vehicle => vehicle.type === selectedType
            )
        }

        if (selectedStatus !== 'All Status') {
            filtered = filtered.filter(
                vehicle => vehicle.status === selectedStatus
            )
        }

        if (search.trim()) {
            filtered = filtered.filter(
                vehicle =>
                    vehicle.id.toLowerCase().includes(search.toLowerCase()) || vehicle.driver.toLowerCase().includes(search.toLowerCase())
            )
        }

        return filtered
    }

    const filteredVehicles = useMemo(
        // eslint-disable-next-line react-hooks/use-memo
        applyFilters,
        [
            vehicles,
            selectedType,
            selectedStatus,
            search
        ]
    )

    return (

        <div>
            <div className="mb-6 fixed top-0 w-full z-40">
                <FleetTopBar />
            </div>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='bg-background'
            >


                <div className="mt-34 mb-10 px-10 bg-background font-sans">


                    {/* Stats */}
                    <FleetStats
                        vehicles={vehicles} />

                    {/* Filters */}
                    <FleetFilters
                        vehicles={vehicles}
                        setVehicles={setVehicles}

                        selectedType={selectedType}
                        setSelectedType={setSelectedType}

                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}

                        search={search}
                        setSearch={setSearch} />

                    {/* Table */}
                    <FleetTable
                        vehicles={filteredVehicles}
                        setVehicles={setVehicles}
                    />

                    {/* Fleet Analytics */}
                    <FleetAnalytics vehicles={filteredVehicles} />

                </div>
            </motion.div>
        </div>

    )
}