"use client"
import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { CircleDashed, Lock, Mail, Phone, User, X } from 'lucide-react'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import axios from 'axios'
import { GrUserAdmin } from 'react-icons/gr'

type propType = {
    open: boolean,
    onClose: () => void
    steps: stepType
}

type stepType = "login" | "otp" | "signup" | null

function AuthModal({ open, steps, onClose }: propType) {
    const [step, setStep] = useState<stepType>("login")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("");
    const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""])
    const [role, setRole] = useState("user")
    const [mobileOtp, setMobileOtp] = useState(["", "", "", "", "", ""])

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(steps)
    }, [steps])
    const { data } = useSession()

    const handleSignUp = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/auth/register", {
                name, email, mobileNumber, password, role
            })
            setErr("")
            setLoading(false);
            setStep("otp")

        } catch (error: any) {
            setLoading(false);
            setErr(`${error.response.data.message ?? error.message}`)

        }
    }

    const handleLogIn = async () => {
        setLoading(true)
        const res = await signIn("credentials", {
            email, password, redirect: false
        })
        setLoading(false)
        console.log(res)

    }

    const handleGoogleLogIn = async () => {
        await signIn("google")
    }

    const handleOtpKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        type: "email" | "mobile"
    ) => {
        if (e.key !== "Backspace") return;

        const value = (e.target as HTMLInputElement).value;

        // If current box has a value, clear it first
        if (value) {
            const updated =
                type === "email" ? [...emailOtp] : [...mobileOtp];

            updated[index] = "";

            if (type === "email") {
                setEmailOtp(updated);
            } else {
                setMobileOtp(updated);
            }

            return;
        }

        // Move to previous box if current is already empty
        if (index > 0) {
            const prevId =
                type === "email"
                    ? `emailOtp-${index - 1}`
                    : `mobileOtp-${index - 1}`;

            (
                document.getElementById(prevId) as HTMLInputElement
            )?.focus();
        }
    };

    const handleChangeEmailOtp = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return

        const updated = [...emailOtp]
        updated[index] = value
        setEmailOtp(updated)
        if (value && index < emailOtp.length - 1) {
            document.getElementById(`emailOtp-${index + 1}`)?.focus()
        }
        if (!value && index > 0) {
            document.getElementById(`emailOtp-${index - 1}`)?.focus()
        }
    }
    const handleChangeMobileOtp = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return

        const updated = [...mobileOtp]
        updated[index] = value
        setMobileOtp(updated)
        if (value && index < mobileOtp.length - 1) {
            document.getElementById(`mobileOtp-${index + 1}`)?.focus()
        }
        if (!value && index > 0) {
            document.getElementById(`mobileOtp-${index - 1}`)?.focus()
        }
    }

    const handleVerification = async () => {
        setLoading(true);
        setErr("");

        try {
            const payload = {
                email,
                emailOtp: emailOtp.join(""),
                mobileNumber,
                mobileOtp: mobileOtp.join(""),
            };

            const { data } = await axios.post(
                "/api/auth/verify",
                payload
            );

            console.log(data);

            setEmailOtp(["", "", "", "", "", ""]);
            setMobileOtp(["", "", "", "", "", ""]);
            setStep(null);
        } catch (error: any) {
            console.error(error);

            setErr(
                error?.response?.data?.message ||
                error?.message ||
                "Verification failed"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <AnimatePresence>
            {open && step != null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    exit={{ opacity: 0, scale: 0.95, y: 40 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                >

                    <div className="
                        relative
                        w-full
                        max-w-md
                        rounded-3xl
                        bg-[#08111F]
                        border border-blue-500/20
                        shadow-[0_0_50px_rgba(37,99,235,0.25)]
                        backdrop-blur-xl
                        p-6 sm:p-8
                        text-white
                        overflow-hidden
                        ">
                        <div className='absolute right-4 top-4 text-gray-400 hover:text-white transition'
                            onClick={onClose} >
                            <X size={20} />
                        </div>

                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold">
                                <span className="text-blue-950">Yatra</span>
                                <span className="text-blue-500">X</span>
                            </h1>

                            <p className="mt-2 text-sm text-gray-400">
                                Smart Transport Booking & Live Tracking
                            </p>
                        </div>


                        {
                            (step == "login" || step == "signup") && (
                                <div>
                                    <button className="
                                w-full h-12
                                rounded-xl
                                border border-white/10
                                bg-white/5
                                text-white
                                flex items-center justify-center gap-3
                                hover:bg-white/10
                                transition
                                cursor-pointer
                                "
                                        onClick={handleGoogleLogIn}>
                                        <Image src={"/google.png"} alt="google" height={40} width={40} />
                                        Continue With Google
                                    </button>

                                    <div className='flex items-center gap-4 my-6'>
                                        <div className='flex-1 h-[1px] bg-white/50' />
                                        <div className='text-xs text-gray-400'>OR</div>
                                        <div className='flex-1 h-[1px] bg-white/50' />
                                    </div>

                                </div>
                            )
                        }
                        <div>

                            {/* Log In */}
                            {
                                step == 'login' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h1 className='text-xl font-semibold'>Welcome back</h1>



                                        <div className='mt-5 space-y-4'>
                                            <div className='flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-4 py-3'>
                                                <Mail size={18} className='text-gray-400' />
                                                <input type="email" placeholder='Email' className='flex-1 outline-none bg-transparent text-sm'
                                                    onChange={(e) => { setEmail(e.target.value) }} value={email}
                                                />
                                            </div>
                                            <div className='flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-4 py-3'>
                                                <Lock size={18} className='text-gray-400' />
                                                <input type="password" placeholder='Password' className='flex-1 outline-none bg-transparent text-sm'
                                                    onChange={(e) => { setPassword(e.target.value) }} value={password}
                                                />
                                            </div>


                                            <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-white hover:text-black'
                                                onClick={handleLogIn}
                                            >
                                                {!loading ? "Log In" :
                                                    <CircleDashed size={18} color='white' className='animate-spin ml-45' />}

                                            </button>


                                        </div>

                                        <p className='mt-6 text-center text-sm text-gray-400'>

                                            Don&apos;t have an account?{" "}
                                            <br></br>
                                            <span
                                                onClick={() => setStep("signup")}
                                                className='text-white font-medium hover:underline cursor-pointer'
                                            >
                                                Sign up
                                            </span>
                                        </p>
                                    </motion.div>
                                )
                            }

                            {/* Sign up */}
                            {
                                step == 'signup' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h1 className='text-xl font-semibold'>Create Account</h1>



                                        <div className='mt-5 space-y-4'>
                                            <div className='flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-4 py-3'>
                                                <User size={18} className='text-gray-400' />
                                                <input type="text" placeholder='Full name' className='flex-1 outline-none bg-transparent text-sm'
                                                    onChange={(e) => { setName(e.target.value) }} value={name}
                                                />
                                            </div>

                                            <div className='flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-4 py-3'>
                                                <Mail size={18} className='text-gray-400' />
                                                <input type="email" placeholder='Email' className='flex-1 outline-none bg-transparent text-sm'
                                                    onChange={(e) => { setEmail(e.target.value) }} value={email}
                                                />
                                            </div>
                                            <div className='flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-4 py-3'>
                                                <Phone size={18} className='text-gray-400' />
                                                <input type="text" placeholder='Mobile Number' className='flex-1 outline-none bg-transparent text-sm'
                                                    onChange={(e) => { setMobileNumber(e.target.value) }} value={mobileNumber}
                                                />
                                            </div>

                                            <div className='flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-4 py-3'>
                                                <Lock size={18} className='text-gray-400' />
                                                <input type="password" placeholder='Password' className='flex-1 outline-none bg-transparent text-sm'
                                                    onChange={(e) => { setPassword(e.target.value) }} value={password}
                                                />
                                            </div>
                                            <div className='flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl px-4 py-3'>
                                                <GrUserAdmin size={18} className='text-gray-400' />

                                                <select
                                                    className='flex-1 outline-none bg-transparent text-sm text-white'
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                >
                                                    <option value="" className='text-black'>
                                                        Select Role
                                                    </option>
                                                    <option value="user" className='text-black'>
                                                        User
                                                    </option>
                                                    <option value="admin" className='text-black'>
                                                        Owner
                                                    </option>
                                                </select>
                                            </div>

                                            {err && <p className='text-red-500'>*{err}</p>}

                                            <button className='w-full h-11 rounded-xl bg-black text-white font-semibold
                                            transition flex justify-center items-center cursor-pointer hover:bg-white hover:text-black'
                                                onClick={handleSignUp}
                                                disabled={loading}
                                            >
                                                {!loading ? "Send otp" :
                                                    <CircleDashed size={18} color='white' className='animate-spin hover:text-black' />}
                                            </button>


                                        </div>

                                        <p className='mt-6 text-center text-sm text-gray-400'>
                                            Already have an account <br>
                                            </br>
                                            <span
                                                onClick={() => setStep("login")}
                                                className='text-white font-medium hover:underline cursor-pointer'

                                            >
                                                Log In
                                            </span>
                                        </p>
                                    </motion.div>
                                )
                            }

                            {/* Otp verification */}
                            {
                                step == "otp" && (
                                    <motion.div
                                        key="otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-2xl font-semibold text-white">
                                            Verify Account
                                        </h2>

                                        <p className="text-gray-400 mt-9">
                                            Email Otp
                                        </p>

                                        <div className="mt-2 flex justify-center gap-2">
                                            {emailOtp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`emailOtp-${i}`}
                                                    value={digit}
                                                    onKeyDown={(e) =>
                                                        handleOtpKeyDown(e, i, "email")
                                                    }
                                                    onChange={(e) => handleChangeEmailOtp(i, e.target.value)}
                                                    className="
                                                        w-12 h-12
                                                        rounded-xl
                                                        text-center
                                                        bg-white/5
                                                        border border-white/10
                                                        text-white
                                                        outline-none
                                                        focus:border-blue-500
                                                        "
                                                />

                                            ))}
                                        </div>
                                        <p className="text-gray-400 mt-10">
                                            Mobile Otp
                                        </p>

                                        <div className="mt-2 flex justify-center gap-2">
                                            {mobileOtp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`mobileOtp-${i}`}
                                                    value={digit}
                                                    onChange={(e) => handleChangeMobileOtp(i, e.target.value)}
                                                    className="
                                                            w-12 h-12
                                                            rounded-xl
                                                            text-center
                                                            bg-white/5
                                                            border border-white/10
                                                            text-white
                                                            outline-none
                                                            focus:border-blue-500
                                                            "
                                                    onKeyDown={(e) =>
                                                        handleOtpKeyDown(e, i, "mobile")
                                                    }
                                                />

                                            ))}
                                        </div>

                                        <button
                                            onClick={handleVerification}
                                            className="mt-8
                                                    w-full
                                                    h-12
                                                    rounded-xl
                                                    bg-gradient-to-r
                                                    from-blue-600
                                                    to-blue-500
                                                    text-white font-semibold
                                                    "

                                        >

                                            Verify OTP & Create Account </button>


                                    </motion.div>
                                )
                            }


                        </div>

                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AuthModal