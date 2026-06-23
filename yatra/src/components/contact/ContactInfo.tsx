'use client'

import {
    Mail,
    Phone,
    MapPin,
    Clock,
} from 'lucide-react'

import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn
} from 'react-icons/fa'

export default function ContactInfo() {
    return (
        <div
            className="
            h-full
            rounded-2xl
            border
            border-blue-500/10
            bg-[#071427]
            p-8
            shadow-[0_0_15px_rgba(59,130,246,0.15)]
            "
        >
            <h1 className="text-3xl font-bold text-white">
                Get in Touch
            </h1>

            <p className="mt-2 text-slate-400">
                We're here to help you!
            </p>

            <div className="mt-10 space-y-8">

                <div className="flex gap-4">
                    <div className="text-blue-400">
                        <Mail />
                    </div>

                    <div>
                        <h3 className="text-white font-medium">
                            Email
                        </h3>

                        <p className="text-slate-400 text-sm">
                            support@yatrax.com
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-blue-400">
                        <Phone />
                    </div>

                    <div>
                        <h3 className="text-white font-medium">
                            Phone
                        </h3>

                        <p className="text-slate-400 text-sm">
                            +91 98765 43210
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-blue-400">
                        <MapPin />
                    </div>

                    <div>
                        <h3 className="text-white font-medium">
                            Address
                        </h3>

                        <p className="text-slate-400 text-sm">
                            Ranchi, Jharkhand, India
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-blue-400">
                        <Clock />
                    </div>

                    <div>
                        <h3 className="text-white font-medium">
                            Working Hours
                        </h3>

                        <p className="text-slate-400 text-sm">
                            Mon - Sat (9:00 AM - 8:00 PM)
                        </p>
                    </div>
                </div>

            </div>

            <div className="mt-12 flex gap-4">

                <button className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-blue-400">
                    <FaFacebookF />
                </button>

                <button className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-blue-400">
                    <FaTwitter />
                </button>

                <button className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-blue-400">
                    <FaInstagram />
                </button>

                <button className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-blue-400">
                    <FaLinkedinIn />
                </button>

            </div>
        </div>
    )
}