'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'

import FleetStats from './FleetStats'
import FleetFilters from './FleetFilters'
import FleetTable from './FleetTable'
import FleetAnalytics from './FleetAnalytics'

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
                    vehicle.id
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    vehicle.driver
                        .toLowerCase()
                        .includes(search.toLowerCase())
            )
        }

        return filtered
    }

    const filteredVehicles = useMemo(
        applyFilters,
        [
            vehicles,
            selectedType,
            selectedStatus,
            search
        ]
    )

    return (

        <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='bg-[#030712]'
        >

            <div className="mt-24 px-10 bg-[#030712] pb-10 px-20 font-sans">

                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        Fleet Management
                    </h1>

                    <p className="text-slate-400 mt-1">
                        Manage and monitor your entire fleet
                    </p>
                </div>

                {/* Stats */}
                <FleetStats
                    vehicles={vehicles} />

                {/* Filters */}
                <div className="mt-6">
                    <FleetFilters
                        vehicles={vehicles}
                        setVehicles={setVehicles}

                        selectedType={selectedType}
                        setSelectedType={setSelectedType}

                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}

                        search={search}
                        setSearch={setSearch} />
                </div>

                {/* Table */}
                <div className="mt-6">
                    <FleetTable
                        vehicles={filteredVehicles}
                        setVehicles={setVehicles}
                    />
                </div>

                <FleetAnalytics vehicles={filteredVehicles} />

            </div>
        </motion.div>
    )
}