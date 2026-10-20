// app/payment/page.tsx
//
// Final step of the booking flow: creates a Razorpay order for the booking,
// opens Razorpay Checkout, and verifies the payment signature server-side
// before marking the booking as paid.

'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { CheckCircle2, XCircle, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import type { RootState } from '../../../src/redux/store'
import GoHomeButton from '../../components/GoHomeButton'
import { useSession } from "next-auth/react";

type OrderInfo = {
  key: string
  orderId: string
  amount: number
  currency: string
  booking: {
    id: string
    boardStopName?: string
    alightStopName?: string
    seatsBooked: number
    farePerPassenger: number
    totalFare: number
    paymentStatus: string
  }
}


type PageState = 'loading' | 'ready' | 'processing' | 'success' | 'error'

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function PaymentPageContent() {
  const params = useSearchParams()
  const router = useRouter()
  const bookingId = params.get('bookingId')
  const userData = useSelector((state: RootState) => state.user.userData) as any

  const [state, setState] = useState<PageState>('loading')
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const { data: session } = useSession();

  const successDestination =
    session?.user?.role === "partner"
      ? "/partnerpage?tab=bookings"
      : "/user";
      
  const initOrder = useCallback(async () => {
    if (!bookingId) {
      setState('error')
      setErrorMessage('No booking was found for this payment. Please book again.')
      return
    }

    setState('loading')
    setErrorMessage('')

    try {
      const { data } = await axios.post('/api/payment/create', { bookingId })

      if (!data.success) {
        throw new Error(data.message || 'Could not start payment')
      }

      if (data.booking.paymentStatus === 'paid') {
        setOrder(data)
        setState('success')
        return
      }

      setOrder(data)
      setState('ready')
    } catch (err: any) {
      setState('error')
      setErrorMessage(
        err?.response?.data?.message || err?.message || 'Could not start payment. Please try again.'
      )
    }
  }, [bookingId])

  useEffect(() => {
    initOrder()
  }, [initOrder])

  const handlePayNow = async () => {
    if (!order) return

    setErrorMessage('')

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setErrorMessage('Could not load Razorpay checkout. Check your connection and try again.')
      return
    }

    // Pull the current primary color so the checkout widget matches
    // whichever theme (light/dark) the user is on, instead of a fixed hex.
    const themeColor =
      typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#111111'
        : '#111111'

    setState('processing')

    const razorpay = new window.Razorpay({
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: 'YatraX',
      description: `Booking ${order.booking.boardStopName ?? ''}${
        order.booking.alightStopName ? ` → ${order.booking.alightStopName}` : ''
      }`,
      order_id: order.orderId,
      prefill: {
        name: userData?.name,
        email: userData?.email,
        contact: userData?.phone,
      },
      theme: {
        color: themeColor,
      },
      handler: async (response: any) => {
        try {
          const { data } = await axios.post('/api/payment/verify', {
            bookingId: order.booking.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })

          if (!data.success) {
            throw new Error(data.message || 'Payment verification failed')
          }

          setState('success')
        } catch (err: any) {
          setState('error')
          setErrorMessage(
            err?.response?.data?.message || err?.message || 'Payment verification failed. Contact support if the amount was deducted.'
          )
        }
      },
      // Explicitly turn on UPI (Razorpay renders "Scan & Pay" QR + intent
      // apps + VPA-collect all under this one method) and put it first,
      // since without this some accounts default to showing card/netbanking
      // ahead of it.
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      config: {
        display: {
          blocks: {
            upiBlock: {
              name: 'Pay by UPI',
              instruments: [{ method: 'upi' }],
            },
            otherBlock: {
              name: 'Other payment methods',
              instruments: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' },
              ],
            },
          },
          sequence: ['block.upiBlock', 'block.otherBlock'],
          preferences: {
            show_default_blocks: false,
          },
        },
      },
      modal: {
        ondismiss: () => {
          setState('ready')
        },
      },
    })

    razorpay.on('payment.failed', (response: any) => {
      setState('ready')
      setErrorMessage(response?.error?.description || 'Payment failed. Please try again.')
    })

    razorpay.open()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 relative">
      {state === 'success' && <GoHomeButton />}
      <div className="bg-card border border-primary/10 rounded-2xl p-8 max-w-md w-full text-center shadow-sm font-sans text-foreground">
        {state === 'loading' && (
          <>
            <Loader2 size={44} className="text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-lg font-semibold mb-1">Preparing your payment…</h1>
            <p className="text-sm text-muted-foreground">Hang tight, this only takes a second.</p>
          </>
        )}

        {(state === 'ready' || state === 'processing') && order && (
          <>
            <ShieldCheck size={44} className="text-primary mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-1">Complete your payment</h1>
            <p className="text-sm text-muted-foreground mb-6">Secured by Razorpay</p>

            <div className="text-left space-y-2 text-sm border border-border rounded-xl p-4 mb-6 bg-background">
              {(order.booking.boardStopName || order.booking.alightStopName) && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Route</span>
                  <span className="text-right">
                    {order.booking.boardStopName} → {order.booking.alightStopName}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Passengers</span>
                <span>{order.booking.seatsBooked}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Fare / passenger</span>
                <span>₹{order.booking.farePerPassenger}</span>
              </div>
              <div className="flex justify-between gap-4 pt-2 border-t border-border font-semibold">
                <span>Total Amount</span>
                <span className="text-success">₹{order.booking.totalFare}</span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-destructive text-sm mb-4">{errorMessage}</p>
            )}

            <button
              onClick={handlePayNow}
              disabled={state === 'processing'}
              className="w-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors rounded-lg py-3 text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === 'processing' ? 'Waiting for payment…' : `Pay ₹${order.booking.totalFare}`}
            </button>

            {/* <button
              onClick={() => router.push('/booking')}
              className="w-full mt-3 flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to booking
            </button> */}

            
          
          </>
        )}

        {state === 'success' && order && (
          <>
            <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Payment successful</h1>
            <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
            <p className="text-sm font-mono text-foreground mb-6 break-all">{order.booking.id}</p>
            <p className="text-sm text-muted-foreground mb-6">
              ₹{order.booking.totalFare} paid successfully. Your booking is confirmed.
            </p>
            <button
              onClick={() => router.push(successDestination)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors rounded-lg py-2.5 text-sm font-semibold cursor-pointer"
            >
              {session?.user?.role === "partner"
                ? "View Partner Bookings"
                : "View my bookings"}
            </button>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle size={48} className="text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">{errorMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/booking')}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
              >
                Back to booking
              </button>
              <button
                onClick={initOrder}
                className="flex-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors py-2.5 text-sm font-semibold cursor-pointer"
              >
                Try again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Keep useSearchParams inside a component rendered beneath Suspense.
// This prevents the production build prerender error for /payment.
export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading payment page...</span>
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  )
}
