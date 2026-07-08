'use client'

import { useState } from 'react'
import type { TripSearchResult, Passenger } from './types'
import { ICON_MAP } from './iconMap'

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'netbanking'

type Props = {
  trip: TripSearchResult
  passengers: Passenger[]
  onBook: (paymentMethod: PaymentMethod) => void
  booking?: boolean
}

export default function SummarySection({ trip, passengers, onBook, booking }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')

  const Icon = ICON_MAP[trip.iconKey] ?? ICON_MAP.bus
  const fare = trip.farePerPassenger * Math.max(passengers.length, 1)
  const canBook = passengers.length > 0 && !booking

  const paymethods = [
    { label: 'UPI', value: 'upi' },
    { label: 'Card', value: 'card' },
    { label: 'Wallet', value: 'wallet' },
    { label: 'Net Banking', value: 'netbanking' },
  ]

  return (
    <div
      className="
        bg-card rounded-2xl p-5 text-foreground w-full lg:max-w-sm
        self-start border border-primary/10 shadow-sm font-sans
      "
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Booking Summary</h2>

      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <Icon size={50} className="text-primary shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-base sm:text-lg capitalize">{trip.vehicleType}</h3>
          <p className="text-sm text-muted-foreground break-words">{trip.brand} {trip.model}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm sm:text-base mb-6">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">From</span>
          <span className="text-right">{trip.boardStopName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">To</span>
          <span className="text-right">{trip.alightStopName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Distance</span>
          <span className="text-right">{trip.distanceKm} km</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Passengers</span>
          <span className="text-right">{passengers.length}</span>
        </div>
      </div>

      <div className="border-y border-border py-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-base sm:text-lg font-semibold">Total Fare</span>
          <span className="text-lg sm:text-xl font-bold text-success">₹{fare}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          ₹{trip.farePerPassenger} × {Math.max(passengers.length, 1)} passenger
          {passengers.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div>
        <h3 className="font-medium mb-4 text-base sm:text-lg">Payment Methods</h3>
        <div className="space-y-3">
          {paymethods.map((method) => (
            <label
              key={method.value}
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-accent transition"
            >
              <span className="text-sm sm:text-base">{method.label}</span>
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={() => setPaymentMethod(method.value as PaymentMethod)}
                className="w-4 h-4 accent-primary"
              />
            </label>
          ))}
        </div>
      </div>

      <button
        disabled={!canBook}
        onClick={() => onBook(paymentMethod)}
        className="
          w-full mt-6 bg-primary text-primary-foreground hover:bg-primary-hover
          transition-colors rounded-lg py-3 text-sm sm:text-base font-semibold cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {booking ? 'Booking…' : canBook ? `Book · ₹${fare}` : 'Add at least one passenger'}
      </button>
    </div>
  )
}
