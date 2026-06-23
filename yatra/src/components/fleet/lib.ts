export function generateAnalytics(vehicles: any[]) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    const fuelData = months.map((month, index) => ({
        month,
        fuel: vehicles.reduce((sum, vehicle) => {
            console.log(vehicle)

            return sum + (vehicle.fuelUsed?.[index] ?? 0)
        }, 0),
    }))

    const revenueData = months.map((month, index) => ({
        month,
        revenue: vehicles.reduce((sum, vehicle) => {
            return sum + (vehicle.revenue?.[index] ?? 0)
        }, 0),
    }))

    const totalPossibleDays = vehicles.length * 30

    const totalActiveDays = vehicles.reduce(
        (sum, vehicle) => sum + vehicle.activeDays,
        0
    )

    const utilization = Math.round(
        (totalActiveDays / totalPossibleDays) * 100
    )

    const totalRevenue = revenueData.reduce(
        (sum, item) => sum + item.revenue,
        0
    )

    const totalFuelUsed = fuelData.reduce(
        (sum, item) => sum + item.fuel,
        0
    )

    return {
        fuelData,
        revenueData,
        utilization,
        totalRevenue,
        totalFuelUsed,
    }
}