import type { TripSearchResult } from './types'
import { ICON_MAP } from './iconMap'

type Props = {
  trip: TripSearchResult
  selected?: boolean
  onSelect?: () => void
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function VehicleCard({ trip, selected, onSelect }: Props) {
  const Icon = ICON_MAP[trip.iconKey] ?? ICON_MAP.bus

  return (
    <div
      onClick={onSelect}
      className={`
        bg-card rounded-xl p-4 flex gap-5 pr-[23px] border shadow-sm cursor-pointer
        transition-colors
        ${selected
          ? "border-primary ring-1 ring-primary"
          : "border-primary/10 hover:border-primary/40"
        }
      `}
    >
      <Icon size={50} className="text-primary shrink-0" />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg text-foreground capitalize">
          {trip.vehicleType}
        </h3>

        <p className="text-muted-foreground text-sm mt-1">
          {trip.brand} {trip.model}
        </p>
      </div>

      <div className="flex flex-col gap-[15px] shrink-0">
        <div className="flex justify-between gap-[80px] sm:gap-[110px] text-foreground">
          <span>{formatTime(trip.departureDateTime)}</span>
          <span>{formatTime(trip.arrivalDateTime)}</span>
        </div>

        <div className="text-sm text-muted-foreground flex justify-between py-3 gap-6">
          <span>{trip.boardStopName}</span>
          <span>{trip.alightStopName}</span>
          <span>{trip.distanceKm} km</span>
        </div>

        <div className="flex justify-between gap-6">
          <p className="text-[15px] text-muted-foreground">
            {trip.availableSeats} seats available
          </p>
          <span className="text-success font-bold text-right">
            ₹{trip.farePerPassenger}
          </span>
        </div>
      </div>
    </div>
  )
}

export default VehicleCard
