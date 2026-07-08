// app/payment/page.tsx
//
// TEMPORARY placeholder — replace with real gateway checkout (Step 8).
// Just confirms the redirect from booking works and shows what was passed.

'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function PaymentPage() {
  const params = useSearchParams()
  const router = useRouter()
  const bookingId = params.get('bookingId')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card border border-primary/10 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <CheckCircle size={48} className="text-success mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Booking created
        </h1>
        <p className="text-sm text-muted-foreground mb-1">
          Booking ID:
        </p>
        <p className="text-sm font-mono text-foreground mb-6 break-all">
          {bookingId ?? '(none passed)'}
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          This is a placeholder payment page. Real gateway checkout (Razorpay/etc.)
          goes here — see Step 8.
        </p>
        <button
          onClick={() => router.push('/booking')}
          className="w-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors rounded-lg py-2.5 text-sm font-semibold"
        >
          Back to booking
        </button>
      </div>
    </div>
  )
}