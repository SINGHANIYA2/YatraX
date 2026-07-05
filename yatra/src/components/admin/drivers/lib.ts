export type DriverStatus = 'available' | 'assigned' | 'maintenance'

/**
 * A partner/driver has no top-level "status" field of its own.
 * Its real-world status is derived from the vehicle assigned to it:
 * - no assigned vehicle          -> "available"
 * - assigned vehicle's status    -> whatever the vehicle currently is
 */
export function getDriverStatus(partner: any): DriverStatus {
    return (partner?.assignedVehicleId?.status as DriverStatus) ?? 'available'
}

export function getDriverStatusLabel(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

export function getVehicleLabel(partner: any) {
    const vehicle = partner?.assignedVehicleId
    if (!vehicle) return '—'
    return vehicle.vehicleType
        ? vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1)
        : (vehicle.vehicleNumber ?? '—')
}
