"use client"
import Nav from "../../src/components/Nav";
import Booking from "../../src/components/booking/Booking"
import PublicHome from "../../src/components/PublicHome";
import FleetManagement from "../../src/components/fleet/FleetManagement";
import AboutPage from "../../src/components/aboutsection/AboutPage";
import ContactPage from "../../src/components/contact/ContactPage";
import AdminSidebar from "../../src/components/admin/sidebar/AdminSidebar";
import AddVehicleForm from "../../src/components/AddVehicleForm";
// import AdminPage from "@/components/admin/page";


export default function Home() {
  return (
    <div className="w-full min-h-screen bg-secondary scroll-thin">
        <Nav/>
        
      <PublicHome/>
    </div>
  );
}
