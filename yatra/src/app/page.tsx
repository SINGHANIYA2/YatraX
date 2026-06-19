"use client"
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Booking from '@/components/BookingSection'
import PublicHome from "@/components/PublicHome";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-800">
      {/* <Nav /> */}
      <Booking />
      {/* <PublicHome/> */}
    </div>
  );
}
