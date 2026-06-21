'use client'

import vehicles from "../vehicles"
import { generateAnalytics } from "./lib"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    RadialBarChart,
    RadialBar,
    PieChart,
    Pie,
    Cell
} from 'recharts'

type Vehicle = {
    fuelUsed: number[]
    revenue: number[]
    activeDays: number
}

export default function FleetAnalytics({
    vehicles
}: {
    vehicles: Vehicle[]
}) {
    const {
    fuelData,
    revenueData,
    utilization,
    totalRevenue,
    totalFuelUsed,
} = generateAnalytics(vehicles)

    const utilizationData = [
        {
            name: "Used",
            value: utilization,
            fill: "#3b82f6",
        },
        {
            name: "Remaining",
            value: 100 - utilization,
            fill: "#0f2038",
        },
    ]

    return (
        <div className="grid grid-cols-3 gap-8 mt-8">

            {/* Fuel Usage */}
            <div
                className="
                rounded-2xl
                border
                border-blue-500/10
                bg-[#071427]
                p-5
                shadow-[0_0_15px_rgba(59,130,246,0.15)]
                "
            >
                <h3 className="text-white text-lg font-semibold mb-4">
                    Fuel Usage
                </h3>

                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={fuelData}>
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="fuel"
                                stroke="#3b82f6"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Utilization */}
            <div
                className="
                rounded-2xl
                border
                border-blue-500/10
                bg-[#071427]
                p-5
                shadow-[0_0_15px_rgba(59,130,246,0.15)]
                "
            >
                <h3 className="text-white text-lg font-semibold mb-4">
                    Vehicle Utilization
                </h3>

                <div className="h-[250px] flex items-center justify-center relative">

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={utilizationData}
                                dataKey="value"
                                innerRadius={80}
                                outerRadius={105}
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            >
                                {utilizationData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.fill}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute text-center">
                        <p className="text-4xl font-bold text-white">
                            {utilization}%
                        </p>

                        <p className="text-slate-400 text-sm">
                            Utilized
                        </p>
                    </div>

                </div>
            </div>

            {/* Revenue */}
            <div
                className="
                rounded-2xl
                border
                border-blue-500/10
                bg-[#071427]
                p-5
                shadow-[0_0_15px_rgba(59,130,246,0.15)]
                "
            >
                <h3 className="text-white text-lg font-semibold mb-4">
                    Revenue Overview
                </h3>

                <div className="h-[250px] outline-none focus:outline-none ring-0" >
                    <ResponsiveContainer width="100%" height="100%"
                        className="focus:outline-none">
                        <BarChart data={revenueData} style={{
                            outline: "none",
                        }}>
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                cursor={false}
                                contentStyle={{
                                    background: "#071427",
                                    border: "1px solid rgba(59,130,246,.2)",
                                    borderRadius: "12px",
                                    color: "#fff",
                                }}
                            />
                            <Bar
                                dataKey="revenue"
                                fill="#3b82f6"
                                radius={[6, 6, 0, 0]}
                                activeBar={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

        </div>
    )
}