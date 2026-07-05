'use client'

import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'

export default function ContactPage() {
    return (
        <div className="px-10 pb-10 bg-background font-sans min-h-screen">

            {/* Header */}
            <div className="pt-5 pb-14 text-center">
                <h1 className="text-5xl font-bold text-foreground">
                    Contact <span className="text-primary">YatraX</span>
                </h1>

                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
                    Have questions, suggestions, or need assistance with your journey?
                    We'd love to hear from you. Our team is here to help you every step of the way.
                </p>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                    <ContactInfo />
                </div>

                <div className="lg:col-span-2">
                    <ContactForm />
                </div>
            </div>

        </div>
    )
}