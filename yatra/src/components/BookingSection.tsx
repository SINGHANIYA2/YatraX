'use client'
import { motion } from 'motion/react'
import vehicles from './vehicles'
import VehicleCard from './VehicleCard'
import SelectSeat from './SelectSeat'
import SummarySection from './SummarySection'

function Booking() {
    return (
        <>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className=" mx-auto mt-28 px-[40px] font-sans"
            >
                {/* search bar */}

                <div className="bg-[#07142C]  rounded-2xl p-[22px] grid grid-cols-6 gap-4 border shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/10 bg-[#0F172A] ">

                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>From</p>
                        <input
                            placeholder=""
                            className="bg-[#102B56] p-3 rounded-lg
                            outline-0"
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>To</p>
                        <input
                            placeholder=""
                            className="bg-[#102B56] p-3 rounded-lg outline-0"
                        />
                    </div>


                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>Date</p>
                        <input
                            type="date"
                            className="bg-[#102B56] text-gray-400 p-3 rounded-lg outline-0"
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <p className='font-bold'>Passengers</p>
                        <input type="text"
                            className='bg-[#102B56] p-3 rounded-lg outline-0'
                        />
                    </div>

                    <div className='flex flex-col gap-2 '>
                        <p className='font-bold'>Vehicle Type</p>

                        <select className="bg-[#102B56] text-gray-400 p-3 rounded-lg outline-0">
                            <option>Bus</option>
                            <option>Taxi</option>
                            <option>Van</option>
                        </select>

                    </div>

                    <button className="bg-gradient-to-r
                            from-blue-600
                            to-blue-500
                            rounded-lg font-semibold cursor-pointer
                            duration-300 transition-all hover:scale-105">
                        Search
                    </button>
                </div>


                <div className="mx-auto mt-4 flex justify-between">

                    <div className="space-y-[6px] w-[42%]">
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
        </>
    )
}

export default Booking