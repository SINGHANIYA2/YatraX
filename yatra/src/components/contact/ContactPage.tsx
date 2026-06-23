'use client'

import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'

export default function ContactPage() {
    return (
        <div className=" px-10 pb-10 bg-[#030712] font-sans">

            <div className="grid mt-24 grid-cols-3 gap-6">

                {/* Left */}
                <div>
                    <ContactInfo />
                </div>

                {/* Right */}
                <div className="col-span-2">
                    <ContactForm />
                </div>

            </div>

        </div>
    )
}