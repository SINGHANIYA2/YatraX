/* eslint-disable react/jsx-no-undef */
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import axios from 'axios'
import VehicleCard from './VehicleCard'
import PassengerDetails from './PassengerDetails'
import SummarySection from './SummarySection'
import ConfirmBookingModal from './ConfirmBookingModal'
import type { Passenger, TripSearchResult } from './types'
import { MOCK_TRIPS, mockCreateBooking } from './mockData' // TEMPORARY — remove once backend is live
import BookingEmptyState from './BookingEmptyState'
import { ChevronLeft } from 'lucide-react'

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'netbanking'

function Booking() {
  const router = useRouter()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')

  const [hasSearched, setHasSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [results, setResults] = useState<TripSearchResult[]>([])

  const [selectedTrip, setSelectedTrip] = useState<TripSearchResult | null>(null)
  const [passengers, setPassengers] = useState<Passenger[]>([])

  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMethod, setConfirmMethod] = useState<PaymentMethod>('upi')
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      setSearchError('Please enter both a source and destination')
      return
    }

    setHasSearched(true)
    setSearching(true)
    setSearchError('')
    setSelectedTrip(null)
    setPassengers([])

    try {
      const { data } = await axios.get('/api/trip/search', {
        params: { source: from.trim(), destination: to.trim(), date: date || undefined },
      })

      const trips = data.trips ?? []

      if (trips.length === 0) {
        
        console.log('Real search returned 0 trips, falling back to mock data')
        setResults(MOCK_TRIPS)
      } else {
        setResults(trips)
      }
    } catch (err: any) {
     
      console.log('Trip search failed, falling back to mock data:', err)
      setResults(MOCK_TRIPS)
      setSearchError('')
    } finally {
      setSearching(false)
    }
  }

  const handleSelectTrip = (trip: TripSearchResult) => {
    setSelectedTrip(trip)
    setPassengers([])
    setBookingError('')
  }

  const handleAddPassenger = (p: Passenger) => setPassengers((prev) => [...prev, p])
  const handleRemovePassenger = (id: string) =>
    setPassengers((prev) => prev.filter((p) => p.id !== id))

  const fare = useMemo(
    () => (selectedTrip ? selectedTrip.farePerPassenger * Math.max(passengers.length, 1) : 0),
    [selectedTrip, passengers.length]
  )

  const handleBook = (method: PaymentMethod) => {
    if (!selectedTrip || passengers.length === 0) return
    setConfirmMethod(method)
    setBookingError('')
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    if (!selectedTrip) return

    setSubmitting(true)
    setBookingError('')

    try {
      const { data } = await axios.post('/api/booking/create', {
        tripId: selectedTrip.tripId,
        boardStopId: selectedTrip.boardStopId,
        alightStopId: selectedTrip.alightStopId,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: Number(p.age),
          gender: p.gender,
        })),
        paymentMethod: confirmMethod,
      })

      router.push(`/payment?bookingId=${data.booking.id}`)
    } catch (err: any) {
     
      console.log('Booking create failed, using mock booking:', err)
      const mock = mockCreateBooking()
      router.push(`/payment?bookingId=${mock.booking.id}`)
    } finally {
      setSubmitting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="bg-background">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-6 px-4 sm:px-6 lg:px-10 font-sans text-foreground pb-8"
      >
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="h-10 w-10 shrink-0 mt-4 ml-3.5 absolute rounded-full border border-border flex items-center justify-center hover:bg-hover transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} className="text-foreground" />
        </button>
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Book Your Journey
          </h1>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
            Search a route, pick a trip, and add your passengers to book.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-card rounded-2xl p-5 border border-primary/10 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-bold">From</p>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Ranchi"
              className="bg-background border border-border p-3 rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold">To</p>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Gaya"
              className="bg-background border border-border p-3 rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold">Date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background border border-border text-foreground p-3 rounded-lg outline-none focus:border-primary [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={searching}
            className="
              bg-primary text-primary-foreground hover:bg-primary-hover transition-colors
              rounded-lg font-semibold cursor-pointer transition-all hover:scale-105
              py-3 self-end disabled:opacity-60 disabled:hover:scale-100
            "
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 flex flex-col xl:flex-row gap-6">
          <div className="w-full xl:w-[42%] space-y-3">
            {hasSearched && !searching && results.length === 0 && (
              <div className="bg-card border border-primary/10 rounded-xl p-6 text-center text-muted-foreground">
                {searchError || 'No trips found for this route.'}
              </div>
            )}

            {results.map((trip) => (
              <VehicleCard
                key={trip.tripId}
                trip={trip}
                selected={selectedTrip?.tripId === trip.tripId}
                onSelect={() => handleSelectTrip(trip)}
              />
            ))}
          </div>

          {selectedTrip && (
            <>
              <PassengerDetails
                trip={selectedTrip}
                passengers={passengers}
                onAdd={handleAddPassenger}
                onRemove={handleRemovePassenger}
              />

              <SummarySection
                trip={selectedTrip}
                passengers={passengers}
                onBook={handleBook}
                booking={submitting}
              />
            </>
          )}
        </div>
      </motion.div>

      {selectedTrip && (
        <ConfirmBookingModal
          open={showConfirm}
          trip={selectedTrip}
          passengers={passengers}
          fare={fare}
          submitting={submitting}
          errorMessage={bookingError}
          onClose={() => (!submitting ? setShowConfirm(false) : undefined)}
          onConfirm={handleConfirm}
        />
      )}
      {!hasSearched && (
        <BookingEmptyState />
      )}
    </div>
  )
}

export default Booking