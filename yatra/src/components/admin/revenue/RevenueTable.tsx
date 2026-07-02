'use client'

import { transactions } from './demo'

export default function RevenueTable() {
    return (
        <div
            className="
            mt-6
            rounded-3xl
            border
            border-primary/10
            bg-card
            p-6
            shadow-sm
            "
        >
            {/* Header */}
            <div className="mb-6">
                <h2
                    className="
                    text-xl
                    font-bold
                    text-foreground
                    "
                >
                    Recent Transactions
                </h2>

                <p
                    className="
                    mt-1
                    text-sm
                    text-muted-foreground
                    "
                >
                    Latest booking payments and revenue records
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">

                    <thead>
                        <tr
                            className="
                            border-b
                            border-border
                            text-left
                            "
                        >
                            <th className="pb-4 text-sm text-muted-foreground">
                                Transaction ID
                            </th>

                            <th className="pb-4 text-sm text-muted-foreground">
                                Booking ID
                            </th>

                            <th className="pb-4 text-sm text-muted-foreground">
                                Vehicle
                            </th>

                            <th className="pb-4 text-sm text-muted-foreground">
                                Customer
                            </th>

                            <th className="pb-4 text-sm text-muted-foreground">
                                Amount
                            </th>

                            <th className="pb-4 text-sm text-muted-foreground">
                                Date
                            </th>

                            <th className="pb-4 text-sm text-muted-foreground">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className="
                                border-b
                                border-border
                                hover:bg-card
                                transition
                                "
                            >
                                <td
                                    className="
                                    py-4
                                    text-foreground
                                    font-medium
                                    "
                                >
                                    {transaction.id}
                                </td>

                                <td className="py-4 text-muted-foreground">
                                    {transaction.bookingId}
                                </td>

                                <td className="py-4 text-muted-foreground">
                                    {transaction.vehicle}
                                </td>

                                <td className="py-4 text-muted-foreground">
                                    {transaction.customer}
                                </td>

                                <td
                                    className="
                                    py-4
                                    text-success
                                    font-semibold
                                    "
                                >
                                    ₹{transaction.amount}
                                </td>

                                <td className="py-4 text-muted-foreground">
                                    {transaction.date}
                                </td>

                                <td className="py-4">
                                    <span
                                        className={`
                                        rounded-full
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium

                                        ${
                                            transaction.status === 'Paid'
                                                ? 'bg-success/15 text-success'
                                                : transaction.status === 'Pending'
                                                ? 'bg-warning/15 text-warning'
                                                : 'bg-destructive/15 text-destructive'
                                        }
                                        `}
                                    >
                                        {transaction.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}