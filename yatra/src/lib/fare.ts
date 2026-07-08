// lib/fare.ts

// Rates rarely change and apply to every vehicle of a given type,
// so this lives as static config rather than a field on each
// Vehicle document (which would mean updating every document
// every time pricing changes).
export const FARE_CONFIG: Record<"bike" | "auto" | "cab" | "bus",{ farePerKm: number; baseFare: number }> = {
  bike: { farePerKm: 3, baseFare: 10 },
  auto: { farePerKm: 8, baseFare: 20 },
  cab: { farePerKm: 12, baseFare: 30 },
  bus: { farePerKm: 2, baseFare: 15 },
};

/**
 * Haversine distance (km) between two [lat, lng] points.
 * Used to compute distanceKm from a vehicle's endPoints at search time,
 * since distance depends on the route, not the vehicle document itself.
 */
export function haversineKm(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number]
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/** Total straight-line distance along an ordered list of [lat, lng] endpoints. */
export function totalRouteDistanceKm(endPoints: [number, number][]): number {
  if (!endPoints || endPoints.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < endPoints.length - 1; i++) {
    total += haversineKm(endPoints[i], endPoints[i + 1]);
  }
  return Math.round(total * 10) / 10; // round to 1 decimal
}

export function calcFarePerPassenger(
  vehicleType: keyof typeof FARE_CONFIG,
  distanceKm: number
): number {
  const { farePerKm, baseFare } = FARE_CONFIG[vehicleType];
  return Math.round(baseFare + farePerKm * distanceKm);
}

export function calcTotalFare(
  vehicleType: keyof typeof FARE_CONFIG,
  distanceKm: number,
  passengerCount: number
): number {
  return calcFarePerPassenger(vehicleType, distanceKm) * Math.max(passengerCount, 1);
}
