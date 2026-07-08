'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, Bus } from 'lucide-react'
import type { Passenger, TripSearchResult } from './types'

type Props = {
  open: boolean
  trip: TripSearchResult
  passengers: Passenger[]
  fare: number
  submitting?: boolean
  errorMessage?: string
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmBookingModal({
  open,
  trip,
  passengers,
  fare,
  submitting,
  errorMessage,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={submitting ? undefined : onClose}
            className="absolute inset-0 bg-black"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-2xl bg-card border border-primary/10 shadow-lg p-6 text-foreground"
          >
            {!submitting && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            )}

            <div className="flex items-center gap-3 mb-5">
              <Bus size={28} className="text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Confirm your booking</h2>
                <p className="text-xs text-muted-foreground">
                  Please review before proceeding to payment
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span>{trip.boardStopName} → {trip.alightStopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Departure</span>
                <span>{new Date(trip.departureDateTime).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 mb-4">
              <p className="text-sm font-medium mb-2">Passengers ({passengers.length})</p>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {passengers.map((p, i) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate">{i + 1}. {p.name}</span>
                    <span className="capitalize shrink-0 ml-2">{p.age} yrs, {p.gender}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center mb-4">
              <span className="font-semibold">Total Fare</span>
              <span className="text-lg font-bold text-success">₹{fare}</span>
            </div>

            {errorMessage && (
              <p className="text-destructive text-sm mb-4">{errorMessage}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={submitting}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
              >
                Edit details
              </button>
              <button
                onClick={onConfirm}
                disabled={submitting}
                className="flex-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors py-2.5 text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Booking…' : 'Confirm & Pay'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
