import React from 'react'
import {
  Ticket,
  MapPin,
  Route,
  Bus,
  Shield,
  Bell
} from "lucide-react";

export const features = [
  {
    icon: Ticket,
    title: "Online Ticket Booking",
    desc: "Book tickets anytime, anywhere.",
    href: "/booking"
  },
  {
    icon: MapPin,
    title: "Live GPS Tracking",
    desc: "Track your vehicle live.",
    href: "/tracking"
  },
  {
    icon: Route,
    title: "Smart Route Management",
    desc: "Optimized routes for operators.",
    href: "/routes"
  },
  {
    icon: Bus,
    title: "Fleet Administration",
    desc: "Manage vehicles and drivers.",
    href: "/fleet"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "100% secure payment gateway.",
    href: "/payments"
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    desc: "Real-time alerts and updates.",
    href: "/notifications"
  }
];
function HeroSection() {
  return (
    <>
        <div>
            {/* left veiw */}
            <div>

            </div>
            {/* right , map-route view */}
            <div>

            </div>
        </div>

        <div className=''>

        </div>

        <div>

        </div>
    </>
  )
}

export default HeroSection