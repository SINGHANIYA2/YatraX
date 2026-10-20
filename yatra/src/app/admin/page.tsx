'use client'

import { motion } from 'motion/react'

import DashboardStats from '../../../src/components/admin/dashboard/DashboardStats'
import FleetAnalytics from '../../../src/components/fleet/FleetAnalytics'
import AdminTopbar from '../../../src/components/admin/dashboard/DashboardTopbar'
import FleetTable from '../../../src/components/fleet/FleetTable'
import { useEffect, useState } from 'react'
import LoadingState from '../../../src/components/ui/LoadingState'


export default function AdminPage() {

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/vehicle");
            const data = await res.json();

            if (data.success) {
                setVehicles(data.vehicles);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchVehicles();
    }, []);

    return (


        <div className='bg-background mb-9'>
            <AdminTopbar></AdminTopbar>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >

                <div className='mt-7'>
                    {loading ? (
                        <LoadingState label="Loading Dashboard..." />
                    ) : (
                        <>
                            <DashboardStats loading={loading} setLoading={setLoading} />
                            <div className='px-6 mt-6' >
                                <FleetTable
                                    vehicles={vehicles}
                                    setVehicles={setVehicles}
                                />
                            </div>

                            {/* <div className='px-6'>
                                <FleetAnalytics
                                    vehicles={vehicles}
                                />
                            </div> */}
                        </>
                    )}
                </div>




            </motion.div>
        </div>
    )
}
