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

import { revenueChartData } from './demo'

export default function RevenueChart() {
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

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={revenueChartData}
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
                        />

                        <Bar
                            dataKey="revenue"
                            fill="var(--primary)"
                            radius={[8, 8, 0, 0]}
                            activeBar={false}
                        />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>
    )
}