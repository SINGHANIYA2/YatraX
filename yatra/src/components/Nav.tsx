"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bus, Menu, X } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Routes", href: "/routes" },
  { name: "Track Vehicle", href: "/track" },
  { name: "Book Tickets", href: "/booking" },
  { name: "Fleet Management", href: "/fleet" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Alert", href: "/alert" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen ,setAuthOpen] = useState(false)
  const [steps,setStep] = useState("")
  

  const handleSignup = () => {
    try {
      setStep("signup")
      setAuthOpen(true);
    } catch (error) {
      console.log(error)
    }
  }
  const handleLogin = () => {
    try {
      setStep("login")
      setAuthOpen(true);
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div
            className="
              flex items-center justify-between
              rounded-2xl
              border border-white/10
              bg-black/80
              backdrop-blur-xl
              px-6 py-4
              shadow-[0_0_50px_rgba(0,0,0,0.6)]
              
            "
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br
                  from-blue-500
                  to-blue-700
                  shadow-lg
                "
              >
                <Bus size={22} />
              </div>

              <h1 className="text-3xl font-bold">
                <span className="text-white">Yatra</span>
                <span className="text-blue-500">X</span>
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`text-sm font-medium transition-all duration-300 ${active
                          ? "text-blue-500"
                          : "text-gray-300 hover:text-white"
                        }`}
                    >
                      {item.name}
                    </motion.span>

                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-full bg-blue-500"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                className="
                  rounded-xl
                  border border-white/10
                  px-5 py-2.5
                  text-sm
                  text-white
                  transition-all
                  hover:border-blue-500
                  hover:bg-blue-500/10
                "
                onClick={handleLogin}
              >
                Login
              </button>

              <button
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-blue-500
                  px-5 py-2.5
                  text-sm
                  font-medium
                  text-white
                  shadow-[0_0_25px_rgba(37,99,235,0.4)]
                  transition-all
                  hover:scale-105
                "
                onClick={handleSignup}
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>


      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            top-24
            left-4
            right-4
            z-40
            rounded-2xl
            border border-white/10
            bg-[#080B16]
            backdrop-blur-xl
            shadow-2xl
            lg:hidden
          "
        >
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="
                  rounded-xl
                  px-4 py-3
                  text-gray-300
                  transition-all
                  hover:bg-blue-500/10
                  hover:text-blue-400
                "
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              <button className="rounded-xl border border-white/10 py-3 text-white"
                 onClick={handleLogin}
              >
                Login
              </button>

              <button
               
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-blue-500
                  py-3
                  font-medium
                  text-white
                "
                onClick={handleSignup}
              >
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      )}
    
      <AuthModal open={authOpen} steps={steps} onClose={() => setAuthOpen(false)} />
    </>
  );
}