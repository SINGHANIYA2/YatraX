'use client'

import { motion } from 'motion/react'
import vehicles from './vehicles'
import VehicleCard from './VehicleCard'
import SelectSeat from './SelectSeat'
import SummarySection from './SummarySection'

function Booking() {
  return (
    <div className="bg-background">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="
          mx-auto
          mt-6
          px-4
          sm:px-6
          lg:px-10
          font-sans
          text-foreground
          pb-8
        "
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              text-foreground
            "
          >
            Book Your Journey
          </h1>

          <p
            className="
              text-muted-foreground
              mt-3
              text-sm
              sm:text-base
              lg:text-lg
              max-w-3xl
              mx-auto
            "
          >
            Find the best buses, taxis, and vans for your next trip.
            Select your destination, choose your seats, and travel comfortably.
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="
            bg-card
            rounded-2xl
            p-5
            border
            border-primary/10
            shadow-sm
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-6
            gap-4
          "
        >
          <div className="flex flex-col gap-2">
            <p className="font-bold">From</p>
            <input
              className="
                bg-card
                p-3
                rounded-lg
                outline-none
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold">To</p>
            <input
              className="
                bg-card
                p-3
                rounded-lg
                outline-none
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold">Date</p>
            <input
              type="date"
              className="
                bg-card
                text-muted-foreground
                p-3
                rounded-lg
                outline-none
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold">Passengers</p>
            <input
              type="text"
              className="
                bg-card
                p-3
                rounded-lg
                outline-none
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold">Vehicle Type</p>

            <select
              className="
                bg-card
                text-muted-foreground
                p-3
                rounded-lg
                outline-none
              "
            >
              <option>Bus</option>
              <option>Taxi</option>
              <option>Van</option>
            </select>
          </div>

          <button
            className="
              bg-primary text-primary-foreground hover:bg-primary-hover transition-colors
              rounded-lg
              font-semibold
              cursor-pointer
              transition-all
              hover:scale-105
              py-3
              self-end
            "
          >
            Search
          </button>
        </div>

        {/* Content */}
        <div
          className="
            mt-6
            flex
            flex-col
            xl:flex-row
            gap-6
          "
        >
          {/* Vehicle Cards */}
          <div
            className="
              w-full
              xl:w-[42%]
              space-y-3
            "
          >
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
              />
            ))}
          </div>

          {/* Seat Selection */}
          <SelectSeat />

          {/* Booking Summary */}
          <SummarySection />
        </div>
      </motion.div>
    </div>
  )
}

export default Booking