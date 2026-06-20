"use client"
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Booking from '@/components/BookingSection'
import PublicHome from "@/components/PublicHome";
import LiveTracking from "@/components/Live Tracking/LiveTracking";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#030712]">
      <Nav />
      {/* <Booking /> */}
      <LiveTracking />
      {/* <PublicHome /> */}
    </div>
  );
}
