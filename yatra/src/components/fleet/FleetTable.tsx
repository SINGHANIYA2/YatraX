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
            return 'bg-success/20 text-success'

        case 'In Transit':
            return 'bg-primary/20 text-primary'

        case 'Maintenance':
            return 'bg-warning/20 text-warning'

        case 'Offline':
            return 'bg-destructive/20 text-destructive'

        default:
            return 'bg-muted/20 text-muted-foreground'
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
            border-primary/10
            bg-card
            overflow-hidden
            mt-5
            shadow-sm
            "
        >
            <table className="w-full">

                {/* Header */}
                <thead className="bg-card">
                    <tr className="text-left">

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Vehicle
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Type
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Driver
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Route
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Status
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Last Updated
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
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
                            border-border
                            transition
                            hover:bg-card
                            "
                        >
                            <td className="px-6 py-4 font-medium text-foreground">
                                {vehicle.id}
                            </td>

                            <td className="px-6 py-4 text-muted-foreground">
                                {vehicle.type}
                            </td>

                            <td className="px-6 py-4 text-muted-foreground">
                                {vehicle.driver}
                            </td>

                            <td className="px-6 py-4 text-muted-foreground">
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

                            <td className="px-6 py-4 text-muted-foreground">
                                {vehicle.updated}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        className="
                                        text-muted-foreground
                                        hover:text-primary
                                        "
                                    >
                                        <Eye className='cursor-pointer' size={18} />
                                    </button>

                                    <button
                                        className="
                                        text-muted-foreground
                                        hover:text-warning
                                        "
                                    >
                                        <Pencil className='cursor-pointer' size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(vehicle.id)}
                                        className="
                                        text-muted-foreground
                                        hover:text-destructive
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