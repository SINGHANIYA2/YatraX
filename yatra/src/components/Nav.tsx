/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bike, Bus, Car, ChevronRight, LogOut, Menu, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";
import { setUserData } from "@/redux/userSlice";
import { setAdminData } from "@/redux/adminSlice";
import { setPartnerData } from "@/redux/partnerSlice";
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
  const [name,setName] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const [steps, setStep] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [role, setRole] = useState("")

  const { userData } = useSelector(
    (state: RootState) => state.user
  );

  const { partnerData } = useSelector(
    (state: RootState) => state.partner
  );

  const { adminData } = useSelector(
    (state: RootState) => state.admin
  );
  const dispatch = useDispatch<AppDispatch>()

  const { data: session, status } = useSession();

  // Session-derived role — used to decide what the profile popup shows
  // (user -> Dashboard + Become Partner, admin/partner -> Dashboard).
  const sessionRole = session?.user?.role;


  useEffect(() => {
    if (status === "authenticated") {
      if(!name || !role){
        setRole(session?.user?.role)
        setName(session?.user?.name)
        setProfileOpen(true)
      }
    }
  }, [session, status]);


  const handleLogOut = async () => {
    await signOut({ redirect: false })
    if (role == "user") dispatch(setUserData(null))
    if (role == "partner") dispatch(setPartnerData(null))
    if (role == "admin") dispatch(setAdminData(null))
    setProfileOpen(false)
    setRole("")
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
      // setProfileOpen(true)
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
        <div className="mx-auto max-w-7xl px-4 py-0.5">
          <div
            className="
              flex items-center justify-between
              rounded-2xl
              border border-border/10
              bg-background
              px-6 py-4
              shadow-sm
              
            "
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-xl
                  bg-primary text-primary-foreground hover:bg-primary-hover transition-colors
                  shadow-lg
                "
              >
                <Bus size={22} />
              </div>

              <h1 className="text-3xl font-bold">
                <span className="text-foreground">Yatra</span>
                <span className="text-primary">X</span>
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
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {item.name}
                    </motion.span>

                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-full bg-primary"
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
              {role == "" ? (
                <>
                  <button
                    className="rounded-xl border border-border/10 px-5 py-2.5 text-sm text-foreground transition-all hover:border-primary hover:bg-primary/10"
                    onClick={handleLogin}
                  >
                    Login
                  </button>

                  <button
                    className="rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors px-5 py-2.5 text-sm font-medium"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg border border-primary/30"
                  >
                    {name.charAt(0)?.toUpperCase()}
           
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
                          className="absolute right-0 top-14 w-72 rounded-2xl border border-border/10 bg-card shadow-lg z-50 overflow-hidden"
                        >
                          <div className="p-5 border-b border-border/10">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                                {name.charAt(0)?.toUpperCase()}
                               
                              </div>

                              <div>
                                <h3 className="text-foreground font-semibold">
                                  {name.toUpperCase()}
                                </h3>

                                <p className="text-xs text-muted-foreground uppercase">
                                  {role.toLowerCase()}
                                  
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-3">
                            {/* Regular user: Dashboard  +  Become Partner */}
                            {sessionRole === "user" && (
                              <>
                                <Link
                                  href="/user"
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition"
                                >
                                  Dashboard
                                </Link>

                                <Link
                                  href="/partner/onboarding"
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition"
                                >
                                  Become Partner
                                </Link>
                              </>
                            )}

                            {/* Admin / Partner: just a normal Dashboard link */}
                            {sessionRole === "admin" && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition"
                              >
                                Dashboard
                              </Link>
                            )}

                            {sessionRole === "partner" && (
                              <Link
                                href="/partnerpage"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition"
                              >
                                Dashboard
                              </Link>
                            )}

                            <button
                              onClick={handleLogOut}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition mt-2"
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
              className="lg:hidden text-foreground"
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
          className="fixed top-24 left-4 right-4 z-40 rounded-2xl border border-border/10 bg-card shadow-lg lg:hidden">
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary">
                {item.name}
              </Link>
            ))}

            {
              (!profileOpen) && (
                <div className="mt-4 flex flex-col gap-3">
                  <button className="rounded-xl border border-border/10 py-3 text-foreground"
                    onClick={handleLogin}
                  >
                    Login
                  </button>

                  <button
                    className="rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors py-3 font-medium"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                </div>
              )
            }

            <AnimatePresence>
              {profileOpen && (userData || adminData || partnerData) && (
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
                    className="fixed inset-x-0 bottom-0 bg-card rounded-t-3xl shadow-lg border-t border-border z-50 md:hidden"
                  >
                    <div className='p-5'>
                      <p className="font-semibold text-lg">
                        {name}
                      </p>
                      <p className='text-xs uppercase text-muted-foreground mb-4'>{role}</p>

                      {
                        role == "partner" &&
                        (
                          <div className='w-full flex items-center gap-3 py-3 hover:bg-secondary rounded-xl'
                            onClick={() => router.push("/partnerpage")}
                          >

                            <div className='flex space-x-2'>
                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Bike size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Car size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Truck size={14} />
                              </div>

                            </div>
                            Partner Dashboard
                            <ChevronRight size={60} className='ml-auto' />
                          </div>

                        )}

                      {
                        role == "user" &&
                        (
                          <div className='w-full flex items-center gap-3 py-3 hover:bg-secondary rounded-xl'
                            onClick={() => router.push("/partner/onboarding")}
                          >

                            <div className='flex space-x-2'>
                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Bike size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Car size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Truck size={14} />
                              </div>

                            </div>
                            Become a Partner {role}
                            <ChevronRight size={60} className='ml-auto' />
                          </div>

                        )}


                      {
                        role == "admin" &&
                        (
                          <div className='w-full flex items-center gap-3 py-3 hover:bg-secondary rounded-xl'
                            onClick={() => router.push("/admin")}
                          >

                            <div className='flex space-x-2'>
                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Bike size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Car size={14} />
                              </div>

                              <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                                <Truck size={14} />
                              </div>

                            </div>
                            Admin section
                            <ChevronRight size={60} className='ml-auto' />
                          </div>

                        )}


                      <button className="h-full rounded-xl flex items-center gap-3 py-3 hover:bg-secondary mt-2"
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
