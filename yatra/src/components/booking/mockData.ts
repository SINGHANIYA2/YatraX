// TEMPORARY — dummy data so the booking UI/flow can be tested end-to-end
// before the backend (Trip search / Booking create) is fully wired up or
// seeded. Booking.tsx falls back to this ONLY when the real API call fails,
// so nothing needs to change here once the backend is ready — it'll just
// stop being used automatically.
//
// DELETE THIS FILE (and its two usages in Booking.tsx) once your backend
// reliably returns real trips and bookings.

import type { TripSearchResult } from './types'

export const MOCK_TRIPS: TripSearchResult[] = [
  {
    tripId: 'mock-trip-1',
    vehicleType: 'bus',
    iconKey: 'bus',
    brand: 'Tata',
    model: 'Starbus AC Sleeper',
    boardStopId: 'mock-stop-src',
    boardStopName: 'Ranchi Bus Stand',
    alightStopId: 'mock-stop-dest',
    alightStopName: 'Gaya Junction',
    boardIndex: 0,
    alightIndex: 1,
    departureDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    arrivalDateTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    distanceKm: 180.4,
    farePerPassenger: 550,
    availableSeats: 18,
  },
  {
    tripId: 'mock-trip-2',
    vehicleType: 'cab',
    iconKey: 'cab',
    brand: 'Maruti',
    model: 'Suzuki Dzire',
    boardStopId: 'mock-stop-src',
    boardStopName: 'Ranchi Bus Stand',
    alightStopId: 'mock-stop-dest',
    alightStopName: 'Gaya Junction',
    boardIndex: 0,
    alightIndex: 1,
    departureDateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    arrivalDateTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
    distanceKm: 180.4,
    farePerPassenger: 2195,
    availableSeats: 3,
  },
  {
    tripId: 'mock-trip-3',
    vehicleType: 'auto',
    iconKey: 'auto',
    brand: 'Bajaj',
    model: 'RE Auto',
    boardStopId: 'mock-stop-src',
    boardStopName: 'Ranchi Bus Stand',
    alightStopId: 'mock-stop-dest',
    alightStopName: 'Gaya Junction',
    boardIndex: 0,
    alightIndex: 1,
    departureDateTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
    arrivalDateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    distanceKm: 180.4,
    farePerPassenger: 1444,
    availableSeats: 1,
  },
]

export function mockCreateBooking() {
  return {
    booking: {
      id: `mock-booking-${Date.now()}`,
      paymentStatus: 'pending',
    },
  }
}
