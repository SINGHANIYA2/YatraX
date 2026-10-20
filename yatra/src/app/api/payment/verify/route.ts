// app/api/payment/verify/route.ts
//
// Verifies the Razorpay checkout response signature server-side (never
// trust the client's word that a payment succeeded) and marks the booking
// as paid.

import crypto from 'crypto'
import connectDb from '../../../../../src/lib/db'
import Booking from '../../../../../src/models/booking.models'
import { auth } from '../../../../../src/auth'
import { NextRequest, NextResponse } from 'next/server'
import { createNotification } from '../../../../../src/lib/notify'

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

    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment verification details' },
        { status: 400 }
      )
    }

    const booking = await Booking.findById(bookingId)

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

    if (booking.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: 'Order mismatch for this booking' },
        { status: 400 }
      )
    }

    // Signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    // This is the only thing that actually proves the payment came from
    // Razorpay and wasn't just a client claiming success.
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      booking.paymentStatus = 'failed'
      await booking.save()

      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      )
    }

    booking.paymentStatus = 'paid'
    booking.razorpayPaymentId = razorpay_payment_id
    booking.razorpaySignature = razorpay_signature
    booking.paidAt = new Date()
    await booking.save()

    await createNotification({
      recipientId: session.user.id,
      recipientRole: 'user',
      title: 'Payment successful',
      message: `₹${booking.totalFare} paid successfully. Your booking is confirmed.`,
      link: '/user',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        booking: {
          id: booking._id.toString(),
          paymentStatus: booking.paymentStatus,
          totalFare: booking.totalFare,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
