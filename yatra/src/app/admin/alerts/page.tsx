'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'motion/react'

import AlertTopBar from '../../../../src/components/admin/alerts/AlertTopBar'
import AlertStats from '../../../../src/components/admin/alerts/AlertStats'
import AlertTable from '../../../../src/components/admin/alerts/AlertTable'

export interface AlertItem {
    id: string
    vehicle: string
    type: string
    severity: 'Critical' | 'Warning' | 'Resolved'
    message: string
    time: string
}

export interface AlertStatsData {
    total: number
    critical: number
    warning: number
    resolved: number
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertItem[]>([])
    const [stats, setStats] = useState<AlertStatsData>({ total: 0, critical: 0, warning: 0, resolved: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const { data } = await axios.get('/api/admin/alerts')
                if (data.success) {
                    setAlerts(data.alerts)
                    setStats(data.stats)
                }
            } catch (error) {
                console.log('Failed to load alerts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAlerts()
    }, [])

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
                    <AlertStats stats={stats} loading={loading} />

                    <div className="mt-6">
                        <AlertTable alerts={alerts} loading={loading} />
                    </div>

                </div>

            </motion.div>

        </div>
    )
}
