'use client'

import AboutHero from './AboutHero'
import StatsCards from './StatsCards'
import FeaturesGrid from './FeaturesGrid'
import { motion } from 'motion/react'

export default function AboutPage() {
    return (
        <div className='bg-[#030712]'>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="
            p-8
         px-10 pb-10
            "
            >

                <div className="mt-18 grid grid-cols-3 gap-4">

                    <div className="col-span-2">
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