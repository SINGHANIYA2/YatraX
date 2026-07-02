'use client'

import { motion } from 'motion/react'

import AlertTopBar from '@/components/admin/alerts/AlertTopBar'
import AlertStats from '@/components/admin/alerts/AlertStats'
import AlertTable from '@/components/admin/alerts/AlertTable'

export default function AlertsPage() {
    return (
        <div className='bg-background h-screen'>
            <div className="w-full fixed top-0 z-40">
                <AlertTopBar />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >

                <div
                    className="
                    bg-background
                    px-6
                    pt-6
                    mt-[100px]
                    font-sans
                    "
                >
                    <AlertStats />

                    <div className="mt-6">
                        <AlertTable />
                    </div>

                </div>

            </motion.div>

        </div>
    )
}