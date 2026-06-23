'use client'

import {
    Eye,
    Pencil,
    Trash2,
    Star
} from 'lucide-react'

type Props = {
    drivers: any[]
    setDrivers: React.Dispatch<React.SetStateAction<any[]>>
}

function getStatusColor(status: string) {
    switch (status) {

        case 'On Duty':
            return 'bg-green-500/20 text-green-400'

        case 'Off Duty':
            return 'bg-red-500/20 text-red-400'

        default:
            return 'bg-slate-500/20 text-slate-400'
    }
}

export default function DriverTable({
    drivers,
    setDrivers
}: Props) {

    function handleDeleteDriver(id: string) {
        setDrivers(prev =>
            prev.filter(driver => driver.id !== id)
        )
    }

    return (
        <div
            className="
            rounded-2xl
            border
            border-blue-500/10
            bg-[#0b1220]
            overflow-hidden
            mt-4
            shadow-[0_0_15px_rgba(59,130,246,0.08)]
            "
        >
            <table className="w-full">

                {/* Header */}
                <thead className="bg-slate-900/60">

                    <tr className="text-left">

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Driver
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Vehicle
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Phone
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Rating
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Experience
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Trips
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Status
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Action
                        </th>

                    </tr>

                </thead>

                {/* Body */}
                <tbody>

                    {drivers.map((driver) => (

                        <tr
                            key={driver.id}
                            className="
                            border-t
                            border-slate-800
                            hover:bg-slate-900/40
                            transition
                            "
                        >

                            {/* Driver */}
                            <td className="px-6 py-4">

                                <div>
                                    <p className="font-medium text-white">
                                        {driver.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {driver.id}
                                    </p>
                                </div>

                            </td>

                            {/* Vehicle */}
                            <td className="px-6 py-4 text-slate-300">
                                {driver.vehicle}
                            </td>

                            {/* Phone */}
                            <td className="px-6 py-4 text-slate-300">
                                {driver.phone}
                            </td>

                            {/* Rating */}
                            <td className="px-6 py-4">

                                <div className="flex items-center gap-1 text-yellow-400">

                                    <Star
                                        size={14}
                                        fill="currentColor"
                                    />

                                    <span>
                                        {driver.rating}
                                    </span>

                                </div>

                            </td>

                            {/* Experience */}
                            <td className="px-6 py-4 text-slate-300">
                                {driver.experience}
                            </td>

                            {/* Trips */}
                            <td className="px-6 py-4 text-slate-300">
                                {driver.trips}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">

                                <span
                                    className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    ${getStatusColor(driver.status)}
                                    `}
                                >
                                    {driver.status}
                                </span>

                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">

                                <div className="flex items-center gap-3">

                                    <button
                                        className="
                                        text-slate-400
                                        cursor-pointer
                                        hover:text-blue-400
                                        "
                                    >
                                        <Eye size={18} />
                                    </button>

                                    <button
                                        className="
                                        text-slate-400
                                        hover:text-yellow-400
                                        cursor-pointer

                                        "
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteDriver(driver.id)
                                        }
                                        className="
                                        text-slate-400
                                        hover:text-red-400
                                        cursor-pointer
                                        "
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
        </div>
    )
}