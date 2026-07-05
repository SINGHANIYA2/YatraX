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
            border-primary/10
            bg-card
            p-8
            shadow-sm
            "
        >
            <h1 className="text-3xl font-bold text-foreground">
                Get in Touch
            </h1>

            <p className="mt-2 text-muted-foreground">
                We're here to help you!
            </p>

            <div className="mt-10 space-y-8">

                <div className="flex gap-4">
                    <div className="text-primary">
                        <Mail />
                    </div>

                    <div>
                        <h3 className="text-foreground font-medium">
                            Email
                        </h3>

                        <p className="text-muted-foreground text-sm">
                            support@yatrax.com
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-primary">
                        <Phone />
                    </div>

                    <div>
                        <h3 className="text-foreground font-medium">
                            Phone
                        </h3>

                        <p className="text-muted-foreground text-sm">
                            +91 98765 43210
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-primary">
                        <MapPin />
                    </div>

                    <div>
                        <h3 className="text-foreground font-medium">
                            Address
                        </h3>

                        <p className="text-muted-foreground text-sm">
                            Ranchi, Jharkhand, India
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-primary">
                        <Clock />
                    </div>

                    <div>
                        <h3 className="text-foreground font-medium">
                            Working Hours
                        </h3>

                        <p className="text-muted-foreground text-sm">
                            Mon - Sat (9:00 AM - 8:00 PM)
                        </p>
                    </div>
                </div>

            </div>

            <div className="mt-12 flex gap-4">

                <button className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <FaFacebookF />
                </button>

                <button className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <FaTwitter />
                </button>

                <button className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <FaInstagram />
                </button>

                <button className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <FaLinkedinIn />
                </button>

            </div>
        </div>
    )
}