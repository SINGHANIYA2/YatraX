'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'motion/react'

import FleetStats from './FleetStats'
import FleetFilters from './FleetFilters'
import FleetTable from './FleetTable'
import FleetAnalytics from './FleetAnalytics'
import FleetTopBar from './FleetTopBar'
import AddVehicleForm from '@/components/AddVehicleForm'

export default function FleetManagement() {

    const [vehicles, setVehicles] = useState<any[]>([]);

    const [selectedType, setSelectedType] =
        useState('All Types')

    const [selectedStatus, setSelectedStatus] =
        useState('All Status')

    const [search, setSearch] =
        useState('')

    const [showAddVehicle, setShowAddVehicle] = useState(false);

    function applyFilters() {

        let filtered = vehicles

        if (selectedType !== 'All Types') {
            filtered = filtered.filter(
                vehicle => vehicle.vehicleType === selectedType
            )
        }

        if (selectedStatus !== 'All Status') {
            filtered = filtered.filter(
                vehicle => vehicle.status === selectedStatus
            )
        }

        if (search.trim().toLocaleLowerCase() !== '') {
            filtered = filtered.filter(
                vehicle =>
                    vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase()) || vehicle.assignedPartnerId?.name.toLowerCase().includes(search.toLowerCase())
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

    const fetchVehicles = async () => {
        try {
            const res = await fetch("/api/admin/vehicle");

            const data = await res.json();

            console.log("Fetched vehicles:", data);

            if (data.success) {
                setVehicles(data.vehicles);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (

        <div>
            <div className="mb-6 fixed top-0 w-full z-40">
                <FleetTopBar />
            </div>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className='bg-[#030712]'
            >


                <div className="mt-34 mb-10 px-10 bg-[#030712] font-sans">


                    {/* Stats */}
                    <FleetStats
                        vehicles={vehicles} />

                    {/* Filters */}
                    <FleetFilters

                        selectedType={selectedType}
                        setSelectedType={setSelectedType}

                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}

                        search={search}
                        setSearch={setSearch}

                        onAddVehicle={() => setShowAddVehicle(true)}
                    />

                    {/* Table */}
                    <FleetTable
                        vehicles={filteredVehicles}
                        setVehicles={setVehicles}
                        fetchVehicles={fetchVehicles}
                    />

                    <AddVehicleForm
                        open={showAddVehicle}
                        onClose={() => setShowAddVehicle(false)}
                        onSuccess={() => {
                            fetchVehicles();
                        }}
                    />

                    {/* Fleet Analytics */}
                    <FleetAnalytics vehicles={filteredVehicles} />

                </div>
            </motion.div>
        </div>

    )
}