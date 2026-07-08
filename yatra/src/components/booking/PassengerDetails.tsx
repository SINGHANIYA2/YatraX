'use client'

import { useState } from 'react'
import { Plus, Trash2, User } from 'lucide-react'
import type { Gender, Passenger, TripSearchResult } from './types'

type Props = {
  trip: TripSearchResult
  passengers: Passenger[]
  onAdd: (p: Passenger) => void
  onRemove: (id: string) => void
}

export default function PassengerDetails({ trip, passengers, onAdd, onRemove }: Props) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [error, setError] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return setError('Passenger name is required')
    if (!age || Number(age) <= 0) return setError('Enter a valid age')
    // availableSeats now comes from the SPECIFIC segment this trip search
    // resolved (board -> alight), not the vehicle's total capacity.
    if (passengers.length >= trip.availableSeats) {
      return setError(`Only ${trip.availableSeats} seats available on this segment`)
    }

    setError('')
    onAdd({ id: crypto.randomUUID(), name: name.trim(), age, gender })
    setName('')
    setAge('')
    setGender('male')
  }

  return (
    <div
      className="
        bg-card rounded-2xl p-5 text-foreground w-full xl:w-[32%]
        self-start border border-primary/10 shadow-sm font-sans
      "
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-1">Passenger details</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {trip.boardStopName} → {trip.alightStopName}
      </p>

      <div className="space-y-3 mb-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-primary"
        />

        <div className="flex gap-3">
          <input
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Age"
            inputMode="numeric"
            className="w-1/3 bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-primary"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="flex-1 bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-primary text-foreground"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <button
          onClick={handleAdd}
          className="
            w-full flex items-center justify-center gap-2
            bg-primary text-primary-foreground hover:bg-primary-hover
            transition-colors rounded-lg py-2.5 text-sm font-semibold cursor-pointer
          "
        >
          <Plus size={16} />
          Add passenger
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
          <span>Passengers added</span>
          <span className="font-medium text-foreground">
            {passengers.length} / {trip.availableSeats}
          </span>
        </div>

        {passengers.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No passengers added yet
          </p>
        )}

        {passengers.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 border border-border rounded-lg px-3 py-2.5"
          >
            <div className="flex items-center gap-2 min-w-0">
              <User size={16} className="text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{i + 1}. {p.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {p.age} yrs · {p.gender}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemove(p.id)}
              aria-label="Remove passenger"
              className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
