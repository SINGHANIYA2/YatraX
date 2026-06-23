'use client'

import { alerts } from './demo'

export default function AlertTable() {
    return (
        <div
            className="
            rounded-3xl
            border
            border-blue-500/10
            bg-[#071427]
            overflow-hidden
            "
        >
            <table className="w-full">

                <thead>
                    <tr
                        className="
                        border-b
                        border-slate-800
                        text-slate-400
                        "
                    >
                        <th className="p-5 text-left">
                            Alert ID
                        </th>

                        <th className="p-5 text-left">
                            Vehicle
                        </th>

                        <th className="p-5 text-left">
                            Type
                        </th>

                        <th className="p-5 text-left">
                            Message
                        </th>

                        <th className="p-5 text-left">
                            Severity
                        </th>

                        <th className="p-5 text-left">
                            Time
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {alerts.map((alert) => (
                        <tr
                            key={alert.id}
                            className="
                            border-b
                            border-slate-900
                            hover:bg-slate-900/30
                            "
                        >
                            <td className="p-5 text-white">
                                {alert.id}
                            </td>

                            <td className="p-5 text-slate-300">
                                {alert.vehicle}
                            </td>

                            <td className="p-5 text-slate-300">
                                {alert.type}
                            </td>

                            <td className="p-5 text-slate-300">
                                {alert.message}
                            </td>

                            <td className="p-5">
                                <span
                                    className={`
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs

                                    ${
                                        alert.severity === 'Critical'
                                            ? 'bg-red-500/15 text-red-400'
                                            : alert.severity === 'Warning'
                                            ? 'bg-yellow-500/15 text-yellow-400'
                                            : 'bg-green-500/15 text-green-400'
                                    }
                                    `}
                                >
                                    {alert.severity}
                                </span>
                            </td>

                            <td className="p-5 text-slate-400">
                                {alert.time}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}