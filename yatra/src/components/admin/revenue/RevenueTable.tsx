'use client'

import { transactions } from './demo'

export default function RevenueTable() {
    return (
        <div
            className="
            mt-6
            rounded-3xl
            border
            border-blue-500/10
            bg-[#071427]
            p-6
            shadow-[0_0_25px_rgba(59,130,246,.06)]
            "
        >
            {/* Header */}
            <div className="mb-6">
                <h2
                    className="
                    text-xl
                    font-bold
                    text-white
                    "
                >
                    Recent Transactions
                </h2>

                <p
                    className="
                    mt-1
                    text-sm
                    text-slate-400
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
                            border-slate-800
                            text-left
                            "
                        >
                            <th className="pb-4 text-sm text-slate-400">
                                Transaction ID
                            </th>

                            <th className="pb-4 text-sm text-slate-400">
                                Booking ID
                            </th>

                            <th className="pb-4 text-sm text-slate-400">
                                Vehicle
                            </th>

                            <th className="pb-4 text-sm text-slate-400">
                                Customer
                            </th>

                            <th className="pb-4 text-sm text-slate-400">
                                Amount
                            </th>

                            <th className="pb-4 text-sm text-slate-400">
                                Date
                            </th>

                            <th className="pb-4 text-sm text-slate-400">
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
                                border-slate-900
                                hover:bg-slate-900/30
                                transition
                                "
                            >
                                <td
                                    className="
                                    py-4
                                    text-white
                                    font-medium
                                    "
                                >
                                    {transaction.id}
                                </td>

                                <td className="py-4 text-slate-300">
                                    {transaction.bookingId}
                                </td>

                                <td className="py-4 text-slate-300">
                                    {transaction.vehicle}
                                </td>

                                <td className="py-4 text-slate-300">
                                    {transaction.customer}
                                </td>

                                <td
                                    className="
                                    py-4
                                    text-green-400
                                    font-semibold
                                    "
                                >
                                    ₹{transaction.amount}
                                </td>

                                <td className="py-4 text-slate-300">
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
                                                ? 'bg-green-500/15 text-green-400'
                                                : transaction.status === 'Pending'
                                                ? 'bg-yellow-500/15 text-yellow-400'
                                                : 'bg-red-500/15 text-red-400'
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