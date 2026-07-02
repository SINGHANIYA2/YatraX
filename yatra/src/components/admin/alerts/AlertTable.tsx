'use client'

import { alerts } from './demo'

export default function AlertTable() {
    return (
        <div
            className="
            rounded-3xl
            border
            border-primary/10
            bg-card
            overflow-hidden
            "
        >
            <table className="w-full">

                <thead>
                    <tr
                        className="
                        border-b
                        border-border
                        text-muted-foreground
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
                            border-border
                            hover:bg-card
                            "
                        >
                            <td className="p-5 text-foreground">
                                {alert.id}
                            </td>

                            <td className="p-5 text-muted-foreground">
                                {alert.vehicle}
                            </td>

                            <td className="p-5 text-muted-foreground">
                                {alert.type}
                            </td>

                            <td className="p-5 text-muted-foreground">
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
                                            ? 'bg-destructive/15 text-destructive'
                                            : alert.severity === 'Warning'
                                            ? 'bg-warning/15 text-warning'
                                            : 'bg-success/15 text-success'
                                    }
                                    `}
                                >
                                    {alert.severity}
                                </span>
                            </td>

                            <td className="p-5 text-muted-foreground">
                                {alert.time}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}