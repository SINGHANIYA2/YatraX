'use client'

import { motion } from 'motion/react'
import {
  Bus,
  MapPinned,
  ShieldCheck,
  Route,
  ArrowRight,
} from 'lucide-react'

export default function BookingEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .6 }}
      className="mt-8 rounded-3xl border border-primary/10 bg-card p-8 shadow-sm"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Find Your Perfect Journey
        </h2>

        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Search buses across multiple routes with real-time seat
          availability, live vehicle tracking and secure booking.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">

        <motion.div
          whileHover={{ y: -6 }}
          className="rounded-2xl border border-primary/10 p-6 bg-background"
        >
          <Bus className="text-primary mb-4" size={34} />
          <h3 className="font-semibold text-lg">
            Live Tracking
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Track your vehicle in real time after booking.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="rounded-2xl border border-primary/10 p-6 bg-background"
        >
          <MapPinned className="text-primary mb-4" size={34} />
          <h3 className="font-semibold text-lg">
            Smart Routes
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Search routes between cities and intermediate stops.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="rounded-2xl border border-primary/10 p-6 bg-background"
        >
          <Route className="text-primary mb-4" size={34} />
          <h3 className="font-semibold text-lg">
            Seat Availability
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Instantly check available seats before booking.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="rounded-2xl border border-primary/10 p-6 bg-background"
        >
          <ShieldCheck className="text-primary mb-4" size={34} />
          <h3 className="font-semibold text-lg">
            Secure Booking
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Safe payments with instant booking confirmation.
          </p>
        </motion.div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        <div className="rounded-2xl bg-background border border-primary/10 p-6">
          <h3 className="font-semibold text-xl mb-5">
            Popular Routes
          </h3>

          <div className="space-y-4">

            {[
              ['Ranchi', 'Gaya'],
              ['Ranchi', 'Patna'],
              ['Patna', 'Gaya'],
              ['Dhanbad', 'Ranchi'],
            ].map(([from, to]) => (
              <motion.div
                whileHover={{ x: 5 }}
                key={`${from}-${to}`}
                className="flex items-center justify-between rounded-xl border border-border p-4 cursor-pointer"
              >
                <span>{from}</span>

                <ArrowRight
                  className="text-primary"
                  size={18}
                />

                <span>{to}</span>
              </motion.div>
            ))}

          </div>
        </div>

        <div className="rounded-2xl bg-background border border-primary/10 p-6">

          <h3 className="font-semibold text-xl mb-5">
            Book in 4 Easy Steps
          </h3>

          <div className="space-y-5">

            {[
              'Search your route',
              'Choose your vehicle',
              'Add passenger details',
              'Confirm your booking',
            ].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * .15,
                }}
                className="flex gap-4 items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <span className="text-muted-foreground">
                  {step}
                </span>
              </motion.div>
            ))}

          </div>

        </div>

      </div>
    </motion.div>
  )
}