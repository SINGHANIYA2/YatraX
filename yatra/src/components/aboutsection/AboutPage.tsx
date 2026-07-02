'use client'

import AboutHero from './AboutHero'
import StatsCards from './StatsCards'
import FeaturesGrid from './FeaturesGrid'
import { motion } from 'motion/react'

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="px-10 pt-28 pb-10"
            >

                {/* Header */}
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
                        ✈️ About YatraX
                    </span>

                    <h1 className="text-5xl font-bold text-foreground">
                        Redefining the Way You
                        <span className="text-primary"> Travel</span>
                    </h1>

                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        YatraX is your all-in-one travel platform designed to make
                        booking buses, taxis, trains, and hotels seamless,
                        secure, and enjoyable.
                    </p>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    <div className="lg:col-span-2">
                        <AboutHero />
                    </div>

                    <div>
                        <StatsCards />
                    </div>

                </div>

                <div className="mt-6">
                    <FeaturesGrid />
                </div>

            </motion.div>
        </div>
    )
}