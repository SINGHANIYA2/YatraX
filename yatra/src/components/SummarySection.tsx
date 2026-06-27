'use client'

import { useState } from 'react'
import {
  Bus,
} from 'lucide-react'
import vehicles from './vehicles'

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'netbanking'

export default function SummarySection() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('upi')

  const [selectedVehicle, setSelectedVehicle] =
    useState(vehicles[0])

  const booking = {
    vehicleName: 'Volvo AC Sleeper',
    vehicleType: 'Bus',
    from: 'Ranchi',
    to: 'Jamshedpur',
    date: '20 May, 2025',
    time: '2:45 PM',
    seats: ['A2', 'A3'],
    passengers: 2,
    fare: 360,
  }

  const paymethods = [
    {
      label: 'UPI',
      value: 'upi',
    },
    {
      label: 'Card',
      value: 'card',
    },
    {
      label: 'Wallet',
      value: 'wallet',
    },
    {
      label: 'Net Banking',
      value: 'netbanking',
    },
  ]

  return (
    <div
      className="
        bg-[#07142C]
        rounded-2xl
        p-5
        text-white
        w-full
        lg:max-w-sm
        self-start
        border
        border-blue-500/10
        shadow-[0_0_15px_rgba(59,130,246,0.15)]
        font-sans
      "
    >
      {/* Heading */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Booking Summary
      </h2>

      {/* Vehicle */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-600 pb-4">
        <div className="rounded-lg flex items-center justify-center">
          <Bus
            size={50}
            className="text-blue-400 shrink-0"
          />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-base sm:text-lg">
            {booking.vehicleType}
          </h3>

          <p className="text-sm text-gray-400 break-words">
            {booking.vehicleName}
          </p>
        </div>
      </div>

      {/* Journey Details */}
      <div className="space-y-4 text-sm sm:text-base mb-6">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">From</span>
          <span className="text-right">
            {booking.from}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">To</span>
          <span className="text-right">
            {booking.to}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Date</span>
          <span className="text-right">
            {booking.date}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Time</span>
          <span className="text-right">
            {booking.time}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Seats</span>
          <span className="text-right">
            {booking.seats.join(', ')}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">
            Passengers
          </span>
          <span className="text-right">
            {booking.passengers}
          </span>
        </div>
      </div>

      {/* Fare */}
      <div className="border-y border-gray-600 py-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-base sm:text-lg font-semibold">
            Total Fare
          </span>

          <span className="text-lg sm:text-xl font-bold text-green-400">
            ₹{booking.fare}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="font-medium mb-4 text-base sm:text-lg">
          Payment Methods
        </h3>

        <div className="space-y-3">
          {paymethods.map((method) => (
            <label
              key={method.value}
              className="
                flex
                items-center
                justify-between
                cursor-pointer
                p-3
                rounded-lg
                hover:bg-white/5
                transition
              "
            >
              <span className="text-sm sm:text-base">
                {method.label}
              </span>

              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={
                  paymentMethod === method.value
                }
                onChange={() =>
                  setPaymentMethod(
                    method.value as PaymentMethod
                  )
                }
                className="w-4 h-4 accent-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <button
        className="
          w-full
          mt-6
          bg-blue-600
          hover:bg-blue-700
          transition
          rounded-lg
          py-3
          text-sm
          sm:text-base
          font-semibold
          cursor-pointer
        "
      >
        Pay ₹{booking.fare}
      </button>
    </div>
  )
}