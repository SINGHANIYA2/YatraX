'use client'

import { motion } from 'motion/react'

import RevenueStats from '@/components/admin/revenue/RevenueStats'
import RevenueChart from '@/components/admin/revenue/RevenueChart'
import RevenueTopBar from '@/components/admin/revenue/RevenueTopBar'
import RevenueTable from '@/components/admin/revenue/RevenueTable'


export default function RevenuePage() {
    return (
        <div className='bg-[#030712] h-screen'>
            <div className="w-full fixed top-0 z-40">
                <RevenueTopBar />
            </div>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className=''
            >

                <div className="bg-[#030712] px-6 pt-6 mt-[100px] font-sans">
                    <RevenueStats />

                    <div className="mt-6">
                        <RevenueChart />
                    </div>

                    <RevenueTable />

                </div>
            </motion.div>
        </div>
    )
}

