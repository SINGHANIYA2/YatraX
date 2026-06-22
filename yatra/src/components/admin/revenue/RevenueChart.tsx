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
            border-blue-500/10
            bg-[#071427]
            p-6
            shadow-[0_0_25px_rgba(59,130,246,.06)]
            "
        >
            <div className="mb-6">

                <h2
                    className="
                    text-xl
                    font-bold
                    text-white
                    "
                >
                    Revenue Overview
                </h2>

                <p
                    className="
                    mt-1
                    text-sm
                    text-slate-400
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
                            stroke="#1e293b"
                        />

                        <XAxis
                            dataKey="month"
                            stroke="#94a3b8"
                        />

                        <YAxis
                            stroke="#94a3b8"
                        />

                        <Tooltip
                            cursor={false}
                            contentStyle={{
                                background: '#071427',
                                border: '1px solid #1e293b',
                                borderRadius: '12px',
                                color: '#fff',
                            }}
                        />

                        <Bar
                            dataKey="revenue"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                            activeBar={false}
                        />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>
    )
}