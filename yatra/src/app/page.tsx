"use client"
import Nav from "@/components/Nav";
import PublicHome from "@/components/PublicHome";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#030712] scroll-thin">
        <Nav/>
      <PublicHome/>
    </div>
  );
}
