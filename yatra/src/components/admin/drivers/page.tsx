'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'

import DriverStats from './DriverStats'
import DriverFilters from './DriverFilters'
import DriverTable from './DriverTable'
import DriverManagementTopBar from './DriverTopBar'

import { drivers as initialDrivers } from './demo'

export default function DriversPage() {

    const [drivers, setDrivers] =
        useState(initialDrivers)

    const [selectedStatus, setSelectedStatus] =
        useState('All Status')

    const [search, setSearch] =
        useState('')

    const filteredDrivers = useMemo(() => {

        let filtered = drivers

        if (selectedStatus !== 'All Status') {
            filtered = filtered.filter(
                driver =>
                    driver.status === selectedStatus
            )
        }

        if (search.trim()) {
            filtered = filtered.filter(
                driver =>
                    driver.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    driver.id
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    driver.vehicle
                        .toLowerCase()
                        .includes(search.toLowerCase())
            )
        }

        return filtered

    }, [
        drivers,
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

                    {/* Heading */}

                    {/* Stats */}
                    <DriverStats
                        drivers={filteredDrivers}
                    />

                    {/* Filters */}
                    <DriverFilters
                        drivers={drivers}
                        setDrivers={setDrivers}

                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}

                        search={search}
                        setSearch={setSearch}
                    />

                    {/* Table */}
                    <DriverTable
                        drivers={filteredDrivers}
                        setDrivers={setDrivers}
                    />

                </div>
            </motion.div>
        </div>
    )
}