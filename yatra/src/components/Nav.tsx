"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bike, Bus, Car, ChevronRight, LogOut, Menu, Truck, X } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { signOut } from "next-auth/react";
import router from "next/router";
import { setUserData } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../redux/store';

const navItems = [
  { name: "Home", href: "/" },
  // { name: "Routes", href: "/routes" },
  { name: "Track Vehicle", href: "/tracking" },
  { name: "Book Tickets", href: "/booking" },
  // { name: "Fleet Management", href: "/admin/fleet" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  // { name: "Alert", href: "/alert" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false)
  const [steps, setStep] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)


  const { userData } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()


  const handleLogOut = async () => {
    await signOut({ redirect: false })
    dispatch(setUserData(null))
    setProfileOpen(false)
  }


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
      setProfileOpen(true)
      console.log("Logged in successfully")
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
        className="fixed top-0 left-0 
        right-0 z-50 font-sans
        "
      >
        <div className="mx-auto max-w-7xl my-3 px-4 py-0.5">
          <div
            className="
              flex items-center justify-between
              rounded-2xl
              border border-white/10
            bg-[#030712]
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
              {!userData ? (
                <>
                  <button
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white transition-all hover:border-blue-500 hover:bg-blue-500/10"
                    onClick={handleLogin}
                  >
                    Login
                  </button>

                  <button
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="h-11 w-11 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg border border-blue-400/30"
                  >
                    {userData?.name?.charAt(0)?.toUpperCase()}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileOpen(false)}
                        />

                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          className="absolute right-0 top-14 w-72 rounded-2xl border border-white/10 bg-[#08111F] backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="p-5 border-b border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                {userData?.name?.charAt(0)?.toUpperCase()}
                              </div>

                              <div>
                                <h3 className="text-white font-semibold">
                                  {userData?.name?.toUpperCase()}
                                </h3>

                                <p className="text-xs text-gray-400 uppercase">
                                  {userData?.role?.toLowerCase()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-3">

                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                            >
                              Profile
                            </Link>

                            <Link
                              href="/booking/my-bookings"
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                              >
                              My Bookings
                            </Link>
                            <Link  href={"/partner/onboarding/become-partner"}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                            
                            >
                              Become Partner
                            </Link>

                            {userData?.role === "admin" && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                              >
                                Admin Dashboard
                              </Link>
                            )}

                            <button
                              onClick={handleLogOut}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition mt-2"
                            >
                              <LogOut size={16} />
                              Logout
                            </button>

                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
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



            {
              !profileOpen && (
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
              )
            }

            <AnimatePresence>
              {profileOpen && userData && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setProfileOpen(false)}
                    className="fixed inset-0 bg-black z-30 md:hidden"
                  />

                  <motion.div
                    initial={{ y: 400 }}
                    animate={{ y: 0 }}
                    exit={{ y: 400 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden"
                  >
                    <div className='p-5'>
                      <p className="font-semibold text-lg">{userData.name}</p>
                      <p className='text-xs uppercase text-gray-500 mb-4'>{userData.role}</p>
                      {userData.role != "partner" &&
                        (
                          <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl'
                            onClick={() => router.push("/partner/onboarding/vehicle")}
                          >

                            <div className='flex space-x-2'>
                              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                <Bike size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                <Car size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                <Truck size={14} />
                              </div>

                            </div>
                            Become a Partner
                            <ChevronRight size={60} className='ml-auto' />
                          </div>

                        )}
                      <button className="h-full rounded-xl flex items-center gap-3 py-3 hover:bg-gray-100 mt-2"
                        onClick={handleLogOut}>
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>


          </div>
        </motion.div>
      )}

      <AuthModal open={authOpen} steps={steps} onClose={() => setAuthOpen(false)} />
    </>
  );
}