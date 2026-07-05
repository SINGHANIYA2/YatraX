'use client'

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'

import type { RevenueChartPoint } from './types'

export default function RevenueChart({ data }: { data: RevenueChartPoint[] }) {
    return (
        <div
            className="
            rounded-3xl
            border
            border-primary/10
            bg-card
            p-6
            shadow-sm
            "
        >
            <div className="mb-6">

                <h2
                    className="
                    text-xl
                    font-bold
                    text-foreground
                    "
                >
                    Revenue Overview
                </h2>

                <p
                    className="
                    mt-1
                    text-sm
                    text-muted-foreground
                    "
                >
                    Monthly revenue performance
                </p>

            </div>

            <div className="h-[350px]">
                {data.every((d) => d.revenue === 0) ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <p className="text-sm font-medium text-foreground">No revenue yet</p>
                        <p className="text-xs text-muted-foreground max-w-xs">
                            Completed and paid bookings will show up here once your partners start driving.
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={data}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--border)"
                            />

                            <XAxis
                                dataKey="month"
                                stroke="var(--muted-foreground)"
                            />

                            <YAxis
                                stroke="var(--muted-foreground)"
                            />

                            <Tooltip
                                cursor={false}
                                contentStyle={{
                                    background: 'var(--card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: 'var(--foreground)',
                                }}
                                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                            />

                            <Bar
                                dataKey="revenue"
                                fill="var(--primary)"
                                radius={[8, 8, 0, 0]}
                                activeBar={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}