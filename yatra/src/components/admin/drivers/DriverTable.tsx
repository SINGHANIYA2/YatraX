'use client'

import { useRouter } from 'next/navigation'
import {
    Eye,
    Pencil,
    Trash2,
    Star
} from 'lucide-react'

type Props = {
    partners: any[]
    setPartners: React.Dispatch<React.SetStateAction<any[]>>
}

function getStatusColor(status: string) {
    switch (status) {

        case 'available':
            return 'bg-green-500/20 text-green-400'

        default:
            return 'bg-slate-500/20 text-slate-400'
    }
}

export default function DriverTable({
    partners,
    setPartners
}: Props) {
    const router = useRouter()

    function handleDeletePartner(id: string) {
        setPartners(prev =>
            prev.filter(partner => partner._id !== id)
        )
    }
    console.log(partners);

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
                            Experience
                        </th>

                        {/* <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Trips
                        </th> */}

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

                    {partners.map((partner) => (

                        <tr
                            key={partner._id}
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
                                        {partner.name}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {partner._id}
                                    </p>
                                </div>

                            </td>

                            {/* Vehicle */}
                            <td className="px-6 py-4 text-slate-300">
                                {partner.assignedVehicleId.vehicleType}
                            </td>

                            {/* Phone */}
                            <td className="px-6 py-4 text-slate-300">
                                {partner.phone}
                            </td>

                            {/* Experience */}
                            <td className="px-6 py-4 text-slate-300">
                                {partner.experience}
                            </td>

                            {/* Trips */}
                            {/* <td className="px-6 py-4 text-slate-300">
                                {partner.trips}
                            </td> */}

                            {/* Status */}
                            <td className="px-6 py-4">

                                <span
                                    className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    ${getStatusColor(partner.assignedVehicleId.status)}
                                    `}
                                >
                                    {partner.assignedVehicleId.status}
                                </span>

                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">

                                <div className="flex items-center gap-3">

                                    <button
                                        onClick={() =>
                                            router.push(`/admin/drivers/${partner._id}`)
                                        }
                                        className="
                                    text-slate-400
                                    cursor-pointer
                                    hover:text-blue-400
                                    "
                                    >
                                        <Eye size={18} />
                                    </button>

                                    {/* <button
                                        className="
                                        text-slate-400
                                        hover:text-yellow-400
                                        cursor-pointer

                                        "
                                    >
                                        <Pencil size={18} />
                                    </button> */}

                                    <button
                                        onClick={() =>
                                            handleDeletePartner(partner._id)
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
        </div >
    )
}