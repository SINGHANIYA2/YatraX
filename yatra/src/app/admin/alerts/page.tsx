'use client'

import { motion } from 'motion/react'

import AlertTopBar from '@/components/admin/alerts/AlertTopBar'
import AlertStats from '@/components/admin/alerts/AlertStats'
import AlertTable from '@/components/admin/alerts/AlertTable'

export default function AlertsPage() {
    return (
        <div className='bg-background min-h-screen'>
            {/* Desktop — fixed, matches AdminTopbar behavior */}
            <div className="hidden md:block w-full fixed top-0 z-40">
                <AlertTopBar />
            </div>

            {/* Mobile — normal flow, sits below AdminLayout's own topbar instead of over it */}
            <div className="md:hidden">
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
                    px-4
                    pt-4
                    sm:px-6
                    md:pt-6
                    md:mt-[84px]
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