'use client'

import { useRouter } from 'next/navigation'
import {
    Eye,
    Pencil,
    Trash2,
    Star
} from 'lucide-react'
import { getDriverStatus, getDriverStatusLabel, getVehicleLabel } from './lib'

type Props = {
    partners: any[]
    setPartners: React.Dispatch<React.SetStateAction<any[]>>
}

function getStatusColor(status: string) {
    switch (status) {
        case 'available':
            return 'bg-green-500/20 text-green-400'
        case 'assigned':
        case 'on_trip':
            return 'bg-blue-500/20 text-blue-400'
        case 'offline':
            return 'bg-red-500/20 text-red-400'
        case 'maintenance':
            return 'bg-yellow-500/20 text-yellow-400'
        default:
            return 'bg-muted/20 text-muted-foreground'
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

    if (partners.length === 0) {
        return (
            <div className="rounded-2xl border border-primary/10 bg-card mt-4 p-12 text-center text-sm text-muted-foreground">
                No drivers found.
            </div>
        )
    }

    return (
        <div
            className="
            rounded-2xl
            border
            border-primary/10
            bg-card
            overflow-hidden
            mt-4
            font-sans
            shadow-sm
            "
        >
            {/* ── Desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
            <table className="w-full">

                {/* Header */}
                <thead className="bg-card">

                    <tr className="text-center">

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Driver
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Vehicle
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Phone
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Experience
                        </th>

                        {/* <th className="px-6 py-4 text-sm font-medium text-slate-400">
                            Trips
                        </th> */}

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Status
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Action
                        </th>

                    </tr>

                </thead>

                {/* Body */}
                <tbody className="text-center">

                    {partners.map((partner) => (

                        <tr
                            key={partner._id}
                            className="
                            border-t
                            border-border
                            hover:bg-card
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
                                        {partner._id.slice(-6) + '......'}
                                    </p>
                                </div>

                            </td>

                            {/* Vehicle */}
                            <td className="px-6 py-4 text-slate-300">
                                {getVehicleLabel(partner)}
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
                                    ${getStatusColor(getDriverStatus(partner))}
                                    `}
                                >
                                    {getDriverStatusLabel(getDriverStatus(partner))}
                                </span>

                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-center text-slate-400">
                                <div className="flex items-center justify-center gap-3">

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
                                        text-muted-foreground
                                        hover:text-warning
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
                                        text-muted-foreground
                                        hover:text-destructive
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

            {/* ── Mobile cards ── */}
            <div className="md:hidden divide-y divide-border">
                {partners.map((partner) => (
                    <div key={partner._id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="font-medium text-white text-base">{partner.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{partner._id.slice(-6) + '......'}</p>
                            </div>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(getDriverStatus(partner))}`}
                            >
                                {getDriverStatusLabel(getDriverStatus(partner))}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground mb-3">
                            <span>🚗 {getVehicleLabel(partner)}</span>
                            <span>📞 {partner.phone}</span>
                            <span>🧭 {partner.experience} yrs exp</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => router.push(`/admin/drivers/${partner._id}`)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm"
                            >
                                <Eye size={14} /> View
                            </button>
                            <button
                                onClick={() => handleDeletePartner(partner._id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive text-sm"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
