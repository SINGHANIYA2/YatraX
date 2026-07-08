export type Gender = 'male' | 'female' | 'other'

export interface Passenger {
  id: string
  name: string
  age: string
  gender: Gender
}

// One row returned by GET /api/trip/search
export interface TripSearchResult {
  tripId: string
  vehicleType: 'bike' | 'auto' | 'cab' | 'bus'
  iconKey: string
  brand?: string
  model?: string

  boardStopId: string
  boardStopName: string
  alightStopId: string
  alightStopName: string
  boardIndex: number
  alightIndex: number

  departureDateTime: string
  arrivalDateTime: string

  distanceKm: number
  farePerPassenger: number
  availableSeats: number
}
