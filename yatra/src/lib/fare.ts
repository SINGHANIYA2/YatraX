// Per-km fare rates by vehicle type (in ₹).
// Adjust these to match your actual pricing model whenever needed.
export const FARE_RATE_PER_KM: Record<string, number> = {
    bike: 8,
    auto: 12,
    cab: 16,
    bus: 20,
};

const DEFAULT_RATE_PER_KM = 12;

export function getFarePerKm(vehicleType?: string | null): number {
    if (!vehicleType) return DEFAULT_RATE_PER_KM;
    return FARE_RATE_PER_KM[vehicleType] ?? DEFAULT_RATE_PER_KM;
}

export function calculateFare(distanceInKm: number, vehicleType?: string | null): number {
    const rate = getFarePerKm(vehicleType);
    const fare = (distanceInKm || 0) * rate;
    // Round to nearest whole rupee.
    return Math.round(fare);
}
