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
            return 'bg-success/20 text-success'

        case 'Off Duty':
            return 'bg-destructive/20 text-destructive'

        default:
            return 'bg-muted/20 text-muted-foreground'
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
            border-primary/10
            bg-card
            overflow-hidden
            mt-4
            shadow-sm
            "
        >
            <table className="w-full">

                {/* Header */}
                <thead className="bg-card">

                    <tr className="text-left">

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Driver
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Vehicle
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Phone
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Rating
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Experience
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Trips
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                            Status
                        </th>

                        <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
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
                            border-border
                            hover:bg-card
                            transition
                            "
                        >

                            {/* Driver */}
                            <td className="px-6 py-4">

                                <div>
                                    <p className="font-medium text-foreground">
                                        {driver.name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {driver.id}
                                    </p>
                                </div>

                            </td>

                            {/* Vehicle */}
                            <td className="px-6 py-4 text-muted-foreground">
                                {driver.vehicle}
                            </td>

                            {/* Phone */}
                            <td className="px-6 py-4 text-muted-foreground">
                                {driver.phone}
                            </td>

                            {/* Rating */}
                            <td className="px-6 py-4">

                                <div className="flex items-center gap-1 text-warning">

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
                            <td className="px-6 py-4 text-muted-foreground">
                                {driver.experience}
                            </td>

                            {/* Trips */}
                            <td className="px-6 py-4 text-muted-foreground">
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
                                        text-muted-foreground
                                        cursor-pointer
                                        hover:text-primary
                                        "
                                    >
                                        <Eye size={18} />
                                    </button>

                                    <button
                                        className="
                                        text-muted-foreground
                                        hover:text-warning
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
    )
}