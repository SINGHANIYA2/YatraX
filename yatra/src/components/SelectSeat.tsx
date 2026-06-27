'use client'

const seats = [
  '1', '2', '', '3', '4',
  '5', '6', '', '7', '8',
  '9', '10', '', '11', '12',
  '13', '14', '', '15', '16',
  '17', '18', '', '19', '20',
  '21', '22', '', '23', '24',
]

export default function SelectSeat() {
  return (
    <div
      className="
        bg-[#07142C]
        rounded-2xl
        p-4
        sm:p-5
        w-full
        lg:w-[32%]
        self-start
        border
        border-blue-500/10
        shadow-[0_0_15px_rgba(59,130,246,0.15)]
      "
    >
      {/* Heading */}
      <h2 className="text-lg sm:text-xl font-semibold mb-5">
        Select Seats - Bus
      </h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs sm:text-sm mb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span>Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>Booked</span>
        </div>
      </div>

      {/* Seats */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {seats.map((seat, index) =>
          seat === '' ? (
            <div key={index}></div>
          ) : (
            <button
              key={index}
              className="
                h-9
                sm:h-10
                rounded-lg
                bg-[#102B56]
                hover:bg-blue-600
                transition
                text-sm
                sm:text-base
                cursor-pointer
              "
            >
              {seat}
            </button>
          )
        )}
      </div>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6 text-sm">
        <div>
          <p className="text-gray-400">
            Selected Seats
          </p>
          <p className="font-semibold">
            A2, A3
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Total Fare
          </p>
          <p className="font-semibold">
            ₹360
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 transition text-sm
          sm:text-base font-semibold cursor-pointer
        "
      >
        Proceed to Pay
      </button>
    </div>
  )
}