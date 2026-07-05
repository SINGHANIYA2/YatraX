'use client'

import { useRouter } from 'next/navigation'
import { Eye, Trash2 } from 'lucide-react'

type Props = {
    vehicles: any[]
    setVehicles: React.Dispatch<React.SetStateAction<any[]>>
    fetchVehicles?: () => Promise<void>
}

function getStatusColor(status: string) {
    switch (status) {
        case 'available': return 'bg-green-500/20 text-green-400'
        case 'assigned': return 'bg-blue-500/20 text-blue-400'
        case 'maintenance': return 'bg-yellow-500/20 text-yellow-400'
        case 'offline': return 'bg-red-500/20 text-red-400'
        default: return 'bg-muted/20 text-muted-foreground'
    }
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

export default function FleetTable({ vehicles, setVehicles, fetchVehicles }: Props) {
    const router = useRouter()

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/admin/vehicle/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!data.success) { alert(data.message); return }
            await fetchVehicles?.()
        } catch (err) {
            console.log(err)
        }
    }

    if (vehicles.length === 0) {
        return (
            <div className="rounded-2xl border border-primary/10 bg-card mt-5 p-12 text-center text-muted-foreground text-sm">
                No vehicles found.
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-primary/10 bg-card overflow-hidden mt-5 shadow-sm">

            {/* â”€â”€ Desktop table â”€â”€ */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-card">
                        <tr className="text-center">
                            {['Vehicle', 'Type', 'Driver', 'Status', 'Last Updated', 'Action'].map(h => (
                                <th key={h} className="px-6 py-4 text-sm font-medium text-muted-foreground">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(vehicle => (
                            <tr key={vehicle._id} className="border-t border-border transition text-center hover:bg-secondary/10">
                                <td className="px-6 py-4 font-medium text-white">{vehicle.vehicleNumber}</td>
                                <td className="px-6 py-4 text-slate-300">
                                    {vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1)}
                                </td>
                                <td className="px-6 py-4 text-slate-300">{vehicle.assignedPartnerId?.name ?? '—'}</td>
                                <td className="px-6 py-4"><StatusBadge status={vehicle.status} /></td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    {new Date(vehicle.updatedAt).toLocaleString('en-IN', {
                                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => router.push(`/admin/fleet/${vehicle._id}`)} className="text-muted-foreground hover:text-primary cursor-pointer">
                                            <Eye size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(vehicle._id)} className="text-muted-foreground hover:text-destructive cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* â”€â”€ Mobile cards â”€â”€ */}
            <div className="md:hidden divide-y divide-border">
                {vehicles.map(vehicle => (
                    <div key={vehicle._id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="font-semibold text-white text-base">{vehicle.vehicleNumber}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1)}
                                </p>
                            </div>
                            <StatusBadge status={vehicle.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground mb-3">
                            <span>ðŸ§‘ {vehicle.assignedPartnerId?.name ?? 'No driver'}</span>
                            <span>ðŸ•’ {new Date(vehicle.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => router.push(`/admin/fleet/${vehicle._id}`)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm"
                            >
                                <Eye size={14} /> View
                            </button>
                            <button
                                onClick={() => handleDelete(vehicle._id)}
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

