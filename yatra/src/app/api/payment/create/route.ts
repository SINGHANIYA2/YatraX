// app/api/payment/create/route.ts
//
// Creates a Razorpay order for an existing (pending-payment) booking and
// returns just enough info for the client to open Razorpay Checkout.

import connectDb from '../../../../../src/lib/db'
import razorpay from '../../../../../src/lib/razorpay'
import Booking from '../../../../../src/models/booking.models'
import { auth } from '../../../../../src/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDb()

    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bookingId } = await req.json()

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: 'bookingId is required' },
        { status: 400 }
      )
    }

    if (!/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking id' },
        { status: 400 }
      )
    }

    const booking = await Booking.findById(bookingId)
      .populate({ path: 'boardStopId', select: 'name city' })
      .populate({ path: 'alightStopId', select: 'name city' })

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (booking.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, message: 'This booking is already paid for' },
        { status: 409 }
      )
    }

    if (booking.bookingStatus === 'cancelled') {
      return NextResponse.json(
        { success: false, message: 'This booking has been cancelled' },
        { status: 409 }
      )
    }

    // Reuse an existing order if one was already created for this booking
    // and hasn't been paid yet, instead of minting a fresh one on every
    // page refresh / retry.
    let orderId = booking.razorpayOrderId

    if (!orderId) {
      const order = await razorpay.orders.create({
        amount: Math.round(booking.totalFare * 100), // paise
        currency: 'INR',
        receipt: booking._id.toString(),
        notes: {
          bookingId: booking._id.toString(),
          userId: session.user.id,
        },
      })

      booking.razorpayOrderId = order.id
      await booking.save()
      orderId = order.id
    }

    return NextResponse.json(
      {
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        orderId,
        amount: Math.round(booking.totalFare * 100),
        currency: 'INR',
        booking: {
          id: booking._id.toString(),
          boardStopName: (booking.boardStopId as any)?.name,
          alightStopName: (booking.alightStopId as any)?.name,
          seatsBooked: booking.seatsBooked,
          farePerPassenger: booking.farePerPassenger,
          totalFare: booking.totalFare,
          paymentStatus: booking.paymentStatus,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
