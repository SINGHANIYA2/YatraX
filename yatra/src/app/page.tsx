"use client"
import Nav from "@/components/Nav";
import Booking from '@/components/BookingSection'
import PublicHome from "@/components/PublicHome";
import LiveTracking from "@/components/tracking/LiveTracking";
import FleetManagement from "@/components/fleet/FleetManagement";
import AboutPage from "@/components/aboutsection/AboutPage";
import ContactPage from "@/components/contact/ContactPage";
import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
// import AdminPage from "@/components/admin/page";


export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#1f2527] scroll-thin">
      {/* <LiveTracking></LiveTracking> */}
      {/* <FleetManagement/> */}
      {/* <PublicHome /> */}
      {/* <Booking></Booking> */}
      {/* <Footer></Footer> */}
      {/* <AboutPage></AboutPage> */}
      {/* <ContactPage></ContactPage> */}
        <Nav/>
      <PublicHome/>
    </div>
  );
}
