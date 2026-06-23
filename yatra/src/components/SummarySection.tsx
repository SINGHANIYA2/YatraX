'use client'

import { useState } from 'react'
import Image from 'next/image'
import vehicles from './vehicles'

import {
    Bus,
    Car,
    Truck,
} from "lucide-react";

export default function SummarySection() {
    const [paymentMethod, setPaymentMethod] =
        useState('upi')

    const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

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
        <div className="bg-[#07142C] rounded-2xl p-5 text-white w-[24.5%] self-start border 
            shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/10 font-sans">
            <h2 className="text-xl font-semibold mb-4">
                Booking Summary
            </h2>

            {/* Vehicle */}
            <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-600 ">
                <div className="rounded-lg flex items-center justify-center">
                    {/* <Image
                        src="/bus.png"
                        alt="Bus"
                        width={40}
                        height={40}
                    /> */}
                    <Bus size={50} className='text-blue-400'/>
                </div>

                <div>
                    <h3 className="font-semibold text-lg">
                        {booking.vehicleType}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {booking.vehicleName}
                    </p>
                </div>
            </div>

            {/* Journey Details */}
            <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-400">From</span>
                    <span>{booking.from}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">To</span>
                    <span>{booking.to}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span>{booking.date}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Time</span>
                    <span>{booking.time}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">Seats</span>
                    <span>{booking.seats.join(', ')}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-400">
                        Passengers
                    </span>
                    <span>{booking.passengers}</span>
                </div>
            </div>

            {/* Fare */}
            <div className="border-y border-gray-600 p-3 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total Fare</span>
                    <span className="text-green-400">
                        ₹{booking.fare}
                    </span>
                </div>
            </div>

            {/* Payment Methods */}
            <div>
                <h3 className="font-medium mb-4">
                    Payment Methods
                </h3>

                <div className="space-y-3">
                    {
                        paymethods.map((method) => (
                            <label
                                key={method.value}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span>{method.label}</span>

                                <input
                                    type="radio"
                                    name="payment"
                                    value={method.value}
                                    checked={
                                        paymentMethod ===
                                        method.value
                                    }
                                    onChange={() =>
                                        setPaymentMethod(
                                            method.value as PaymentMethod
                                        )
                                    }
                                    className="w-4 h-4"
                                />
                            </label>
                        ))}
                </div>
            </div>

            {/* Pay Button */}
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold cursor-pointer">
                Pay ₹{booking.fare}
            </button>
        </div>
    )
}