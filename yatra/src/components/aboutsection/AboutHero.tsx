'use client'

import { motion } from 'motion/react'

export default function AboutHero() {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="
            rounded-2xl
            border
            border-primary/10
            bg-card
            p-8
            flex
            flex-col
            gap-3
            shadow-sm
            "
 
 >
            <h1 className="text-foreground text-[28px] font-sans font-bold mb-2 ">
                About Yatra
                <span className='text-primary text-[33px]'>X</span>
            </h1>

            <h1 className="text-5xl font-bold text-foreground leading-tight">
                Driving the Future
                <br />
                of Smart Transportation
            </h1>

            <p className="mt-5 text-muted-foreground max-w-2xl leading-7">
                YatraX is a next-generation transport management
                platform that connects passengers, operators,
                and fleet owners in a single intelligent ecosystem.
            </p>

            <p className="mt-4 text-muted-foreground max-w-2xl leading-7">
                We help book tickets, manage fleets, optimize
                routes, and provide real-time data and analytics.
            </p>
        </motion.div>
    )
}