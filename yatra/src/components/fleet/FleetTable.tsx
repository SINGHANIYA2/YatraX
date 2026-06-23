'use client'

import {
    Eye,
    Pencil,
    Trash2
} from 'lucide-react'

type Props = {
    vehicles: any[]
    setVehicles: React.Dispatch<React.SetStateAction<any[]>>
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Active':
            return 'bg-green-500/20 text-green-400'

        case 'In Transit':
            return 'bg-blue-500/20 text-blue-400'

        case 'Maintenance':
            return 'bg-yellow-500/20 text-yellow-400'

        case 'Offline':
            return 'bg-red-500/20 text-red-400'

        default:
            return 'bg-slate-500/20 text-slate-400'
    }
}

export default function FleetTable({
    vehicles,
    setVehicles
}: Props) {

    function handleDelete(id: string) {
        setVehicles(prev =>
            prev.filter(vehicle => vehicle.id !== id)
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
            mt-5
            shadow-[0_0_15px_rgba(59,130,246,0.15)]
            "
        >
            <table className="w-full">

                {/* Header */}
                <thead className="bg-slate-900/60">
                    <tr className="text-left">

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Vehicle
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Type
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Driver
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Route
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Status
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Last Updated
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Action
                        </th>

                    </tr>
                </thead>

                {/* Body */}
                <tbody>

                    {vehicles.map((vehicle) => (
                        <tr
                            key={vehicle.id}
                            className="
                            border-t
                            border-slate-800
                            transition
                            hover:bg-slate-900/40
                            "
                        >
                            <td className="px-6 py-4 font-medium text-white">
                                {vehicle.id}
                            </td>

                            <td className="px-6 py-4 text-slate-300">
                                {vehicle.type}
                            </td>

                            <td className="px-6 py-4 text-slate-300">
                                {vehicle.driver}
                            </td>

                            <td className="px-6 py-4 text-slate-300">
                                {vehicle.route}
                            </td>

                            <td className="px-6 py-4">
                                <span
                                    className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    ${getStatusColor(vehicle.status)}
                                    `}
                                >
                                    {vehicle.status}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-slate-400">
                                {vehicle.updated}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        className="
                                        text-slate-400
                                        hover:text-blue-400
                                        "
                                    >
                                        <Eye className='cursor-pointer' size={18} />
                                    </button>

                                    <button
                                        className="
                                        text-slate-400
                                        hover:text-yellow-400
                                        "
                                    >
                                        <Pencil className='cursor-pointer' size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(vehicle.id)}
                                        className="
                                        text-slate-400
                                        hover:text-red-400
                                        cursor-pointer
                                        "
                                    >
                                        <Trash2 className='cursor-pointer' size={18} />
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