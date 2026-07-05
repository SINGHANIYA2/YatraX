'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'

import RevenueStats from '@/components/admin/revenue/RevenueStats'
import RevenueChart from '@/components/admin/revenue/RevenueChart'
import RevenueTopBar from '@/components/admin/revenue/RevenueTopBar'
import RevenueTable from '@/components/admin/revenue/RevenueTable'
import LoadingState from '@/components/ui/LoadingState'
import type { RevenueChartPoint, RevenueStatsData, RevenueTransaction } from '@/components/admin/revenue/types'

const EMPTY_STATS: RevenueStatsData = {
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    growthRate: 0,
    totalBookings: 0,
}

export default function RevenuePage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState<RevenueStatsData>(EMPTY_STATS)
    const [chartData, setChartData] = useState<RevenueChartPoint[]>([])
    const [transactions, setTransactions] = useState<RevenueTransaction[]>([])

    async function fetchRevenue() {
        try {
            setLoading(true)
            setError(null)
            const res = await axios.get('/api/admin/revenue')
            setStats(res.data.stats)
            setChartData(res.data.chartData)
            setTransactions(res.data.transactions)
        } catch (err) {
            console.error(err)
            setError('Failed to load revenue data.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRevenue()
    }, [])

    return (
        <div className='bg-background min-h-screen'>
            {/* Desktop — fixed, matches AdminTopbar behavior */}
            <div className="hidden md:block w-full fixed top-0 z-40">
                <RevenueTopBar />
            </div>

            {/* Mobile — normal flow, sits below AdminLayout's own topbar instead of over it */}
            <div className="md:hidden">
                <RevenueTopBar />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className=''
            >

                <div className="bg-background px-4 pt-4 sm:px-6 md:pt-6 md:mt-[72px] pb-8 font-sans">
                    {loading ? (
                        <LoadingState label="Loading revenue..." />
                    ) : error ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-card p-8 text-center text-sm text-destructive">
                            {error}
                            <button
                                onClick={fetchRevenue}
                                className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <RevenueStats stats={stats} />

                            <div className="mt-6">
                                <RevenueChart data={chartData} />
                            </div>

                            <RevenueTable transactions={transactions} />
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
