/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { CircleDashed, Lock, Mail, Phone, User, X } from 'lucide-react'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import axios from 'axios'
import { GrUserAdmin } from 'react-icons/gr'

type propType = {
    open: boolean,
    onClose: () => void
    steps: string
}

type stepType = "login" | "otp" | "signup" | null | "adminDetail"

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
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
        // console.log("User:", session?.user);
        // console.log("Role:", session?.user?.role);

        if (session?.user?.role === "admin") {
            setRole("admin")
        }

        if (session?.user?.role === "partner") {
            // do partner stuff
            setRole("partner")
        }
        // console.log("role aurth modal: ",role)
        }
    }, [session, status]);

    const [adminData, setAdminData] = useState({
        organizationName: "",
        organizationType: "",
        gstNumber: "",
        panNumber: "",
        registrationNumber: "",
        alternatePhone: "",

        address: "",
        city: "",
        state: "",
        pincode: "",

        totalVehicles: "",

        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",

    });

    const canSubmit = !!(adminData.accountHolderName && adminData.registrationNumber && adminData.accountNumber && adminData.addressLine1 && adminData.alternatePhone && adminData.bankName &&
        adminData.city && adminData.gstNumber && adminData.ifscCode && adminData.organizationName && adminData.organizationType &&
        adminData.panNumber && adminData.pincode && adminData.state && adminData.upiId && adminData.addressLine1
    )

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(steps as stepType)
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
    const handleAdminDetailsSubmit = async () => {
        try {
            setLoading(true);
            if (!adminData.organizationName.trim()) {
                return setErr("Organization name is required");
            }

            if (!adminData.organizationType) {
                return setErr("Organization type is required");
            }

            if (!adminData.panNumber.trim()) {
                return setErr("PAN number is required");
            }

            if (!adminData.address.trim()) {
                return setErr("Address is required");
            }

            if (!adminData.city.trim()) {
                return setErr("City is required");
            }

            if (!adminData.state.trim()) {
                return setErr("State is required");
            }

            if (!adminData.pincode.trim()) {
                return setErr("Pincode is required");
            }

            if (!adminData.bankName.trim()) {
                return setErr("Bank name is required");
            }

            if (!adminData.accountHolderName.trim()) {
                return setErr("Account holder name is required");
            }

            if (!adminData.accountNumber.trim()) {
                return setErr("Account number is required");
            }

            if (!adminData.ifscCode.trim()) {
                return setErr("IFSC code is required");
            }

            setErr("");

            const payload = {
                email,
                ...adminData,
            };

            const { data } = await axios.post("/api/admin/create-profile", payload);

            console.log(data);

            setLoading(false);
            // setAdminDetail(false);
            setStep(null)
            onClose();

        } catch (error: any) {
            setLoading(false);

            setErr(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
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
            setStep("adminDetail");
            // setAdminDetail(true)
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
                            onClick={() => {
                                if (!(role === "admin" && !canSubmit)){
                                    onClose();
                                }
                            }} >
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

                            {/* Admin detail */}

                            {step == "adminDetail" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="max-h-[70vh] overflow-y-auto space-y-4"
                                >

                                    <h2 className="text-2xl font-bold text-white">
                                        Organization Details
                                    </h2>

                                    <input
                                        placeholder="Organization Name"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.organizationName}
                                        onChange={(e) => setAdminData({ ...adminData, organizationName: e.target.value })}
                                    />

                                    <select
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.organizationType}
                                        onChange={(e) => setAdminData({ ...adminData, organizationType: e.target.value })}
                                    >
                                        <option value="" className='text-black'>Select Organization Type</option>
                                        <option value="Bus Operator text-black">Bus Operator</option>
                                        <option value="Travel Agency text-black">Travel Agency</option>
                                        <option value="Fleet Owner text-black">Fleet Owner</option>
                                    </select>

                                    <input
                                        placeholder="GST Number"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.gstNumber}
                                        onChange={(e) => setAdminData({ ...adminData, gstNumber: e.target.value })}
                                    />

                                    <input
                                        placeholder="PAN Number"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.panNumber}
                                        onChange={(e) => setAdminData({ ...adminData, panNumber: e.target.value })}
                                    />

                                    <input
                                        placeholder="Registration Number"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.registrationNumber}
                                        onChange={(e) => setAdminData({ ...adminData, registrationNumber: e.target.value })}
                                    />

                                    <input
                                        placeholder="Address"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.address}
                                        onChange={(e) => setAdminData({ ...adminData, address: e.target.value })}
                                    />

                                    <div className="grid grid-cols-2 gap-3">

                                        <input
                                            placeholder="City"
                                            className="border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                            value={adminData.city}
                                            onChange={(e) => setAdminData({ ...adminData, city: e.target.value })}
                                        />

                                        <input
                                            placeholder="State"
                                            className="border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                            value={adminData.state}
                                            onChange={(e) => setAdminData({ ...adminData, state: e.target.value })}
                                        />

                                    </div>

                                    <input
                                        placeholder="Pincode"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.pincode}
                                        onChange={(e) => setAdminData({ ...adminData, pincode: e.target.value })}
                                    />

                                    <input
                                        placeholder="Total Vehicles"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.totalVehicles}
                                        onChange={(e) => setAdminData({ ...adminData, totalVehicles: e.target.value })}
                                    />

                                    <h3 className="text-lg font-semibold text-white mt-4">
                                        Bank Details
                                    </h3>

                                    <input
                                        placeholder="Bank Name"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.bankName}
                                        onChange={(e) => setAdminData({ ...adminData, bankName: e.target.value })}
                                    />

                                    <input
                                        placeholder="Account Holder Name"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.accountHolderName}
                                        onChange={(e) => setAdminData({ ...adminData, accountHolderName: e.target.value })}
                                    />

                                    <input
                                        placeholder="Account Number"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.accountNumber}
                                        onChange={(e) => setAdminData({ ...adminData, accountNumber: e.target.value })}
                                    />

                                    <input
                                        placeholder="IFSC Code"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.ifscCode}
                                        onChange={(e) => setAdminData({ ...adminData, ifscCode: e.target.value })}
                                    />

                                    <input
                                        placeholder="UPI ID"
                                        className="w-full border border-white/10 bg-white/5 rounded-xl px-4 py-3"
                                        value={adminData.upiId}
                                        onChange={(e) => setAdminData({ ...adminData, upiId: e.target.value })}
                                    />

                                    {err && (<p className='text-red-600 text-xl'>*{err}</p>)}

                                    <button
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 cursor-pointer to-blue-500 font-semibold mt-4"
                                        onClick={handleAdminDetailsSubmit}
                                    >
                                        Submit
                                    </button>

                                </motion.div>
                            )}

                        </div>

                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AuthModal