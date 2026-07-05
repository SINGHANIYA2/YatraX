"use client"
import Nav from "@/components/Nav";
import Booking from '@/components/BookingSection'
import PublicHome from "@/components/PublicHome";
import FleetManagement from "@/components/fleet/FleetManagement";
import AboutPage from "@/components/aboutsection/AboutPage";
import ContactPage from "@/components/contact/ContactPage";
import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
import AddVehicleForm from "@/components/AddVehicleForm";
// import AdminPage from "@/components/admin/page";


export default function Home() {
  return (
    <div className="w-full min-h-screen bg-secondary scroll-thin">
      {/* <LiveTracking></LiveTracking> */}
      {/* <FleetManagement/> */}
      {/* <PublicHome /> */}
      {/* <Booking></Booking> */}
      {/* <Footer></Footer> */}
      {/* <AboutPage></AboutPage> */}
      {/* <ContactPage></ContactPage> */}
        <Nav/>
        {/* <AddVehicleForm></AddVehicleForm> */}
      <PublicHome/>
    </div>
  );
}
