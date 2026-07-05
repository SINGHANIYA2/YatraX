export type RevenueStatsData = {
    totalRevenue: number
    monthlyRevenue: number
    todayRevenue: number
    growthRate: number
    totalBookings: number
}

export type RevenueChartPoint = {
    month: string
    revenue: number
}

export type RevenueTransaction = {
    id: string
    bookingId: string
    vehicle: string
    customer: string
    amount: number
    status: 'Paid' | 'Refunded' | 'Failed' | 'Pending'
    date: string
}
