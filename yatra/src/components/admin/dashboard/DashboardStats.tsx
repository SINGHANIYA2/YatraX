'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Bus,
    Users,
    IndianRupee,
    TriangleAlert,
} from 'lucide-react'

import StatCard from './StatCard'

type DashboardStatsResponse = {
    success: boolean
    message?: string
    stats: {
        vehicles: {
            total: number
            active: number
            assigned: number
            available: number
            maintenance: number
        }
        partners: {
            total: number
            online: number
            available: number
        }
        pendingRequests: number
        revenue: {
            total: number
            monthly: number
            today: number
            averageFare: number
        }
    }
}

const REFRESH_INTERVAL_MS = 20000

function formatCurrency(value: number) {
    if (value >= 100000) {
        const lakhs = Math.round((value / 100000) * 10) / 10
        if (lakhs >= 100) {
            return `₹${Math.round((value / 10000000) * 10) / 10}Cr`
        }
        return `₹${lakhs}L`
    }

    if (value >= 1000) {
        const thousands = Math.round((value / 1000) * 10) / 10
        if (thousands >= 100) {
            return `₹${Math.round((value / 100000) * 10) / 10}L`
        }
        return `₹${thousands}K`
    }

    return `₹${value}`
}

type Props = {
    loading: boolean
    setLoading: (loading: boolean) => void
}

export default function DashboardStats({ loading, setLoading }: Props) {
    const router = useRouter()

    const [stats, setStats] = useState<DashboardStatsResponse['stats'] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const isMounted = useRef(true)
    const controllerRef = useRef<AbortController | null>(null)

    const fetchStats = useCallback(async (isBackground = false) => {
        controllerRef.current?.abort()
        const controller = new AbortController()
        controllerRef.current = controller

        try {
            if (!isBackground) setLoading(true)
            setError(null)

            const res = await fetch('/api/admin/dashboard', {
                signal: controller.signal,
            })

            if (res.status === 401) {
                router.push('/signin')
                return
            }

            const data: DashboardStatsResponse = await res.json()

            if (!isMounted.current) return

            if (!data.success) {
                setError(data.message ?? 'Failed to load dashboard stats.')
                return
            }

            setStats(data.stats)
            setLastUpdated(new Date())
        } catch (err: any) {
            if (err?.name === 'AbortError') return
            if (!isMounted.current) return
            console.log(err)
            setError('Failed to load dashboard stats.')
        } finally {
            if (isMounted.current && !isBackground) setLoading(false)
        }
    }, [router, setLoading])

    useEffect(() => {
        isMounted.current = true
        fetchStats()

        const interval = setInterval(() => {
            fetchStats(true)
        }, REFRESH_INTERVAL_MS)

        return () => {
            isMounted.current = false
            controllerRef.current?.abort()
            clearInterval(interval)
        }
    }, [fetchStats])

    if (error) {
        return (
            <div className="px-4 sm:px-6">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-card p-6 text-center text-sm text-destructive">
                    {error}
                    <button
                        onClick={() => fetchStats()}
                        className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    const cards = [
        {
            title: 'Active Vehicles',
            value: stats ? stats.vehicles.active : 0,
            icon: Bus,
            color: 'text-primary',
        },
        {
            title: 'Drivers On Duty',
            value: stats ? stats.partners.online : 0,
            icon: Users,
            color: 'text-success',
        },
        {
            title: 'Revenue Today',
            value: stats ? formatCurrency(stats.revenue.today) : '₹0',
            icon: IndianRupee,
            color: 'text-warning',
        },
        {
            title: 'Pending Requests',
            value: stats ? stats.pendingRequests : 0,
            icon: TriangleAlert,
            color: 'text-destructive',
            onClick: () => router.push('/admin/applications'),
        },
    ]

    return (
        <div className="px-4 sm:px-6">
            {lastUpdated && !loading && (
                <>
                    <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-4">
                        {cards.map((stat) => (
                            <StatCard
                                key={stat.title}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                color={stat.color}
                                loading={loading}
                                onClick={stat.onClick}
                            />
                        ))}
                    </div>
                    <p className="mt-2 text-right text-[11px] text-muted-foreground">
                        Last updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </>
            )}
        </div>
    )
}