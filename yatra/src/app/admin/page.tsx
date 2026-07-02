'use client'

import { motion } from 'motion/react'

import DashboardStats from '@/components/admin/dashboard/DashboardStats'
import { fleetVehicles } from '@/components/fleet/demo'
import FleetAnalytics from '@/components/fleet/FleetAnalytics'
import AdminTopbar from '@/components/admin/dashboard/DashboardTopbar'
import FleetTable from '@/components/fleet/FleetTable'


export default function AdminPage() {
    return (


        <div className='bg-background mb-9'>
            <AdminTopbar></AdminTopbar>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >

                <div className='mt-7'>
                    <DashboardStats />
                </div>


                <div className='px-6 mt-6'>
                    <FleetTable
                        vehicles={fleetVehicles}
                        setVehicles={() => { }}
                    />
                </div>

                <div className='px-6'>
                    <FleetAnalytics
                        vehicles={fleetVehicles}
                    />
                </div>

            </motion.div>
        </div>
    )
}
