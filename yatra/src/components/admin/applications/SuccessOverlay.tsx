'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'

interface Props {
    show: boolean
    title: string
    subtitle?: string
    onDone: () => void
    duration?: number
}

export default function SuccessOverlay({
    show,
    title,
    subtitle,
    onDone,
    duration = 1800
}: Props) {

    useEffect(() => {
        if (!show) return
        const t = setTimeout(onDone, duration)
        return () => clearTimeout(t)
    }, [show, duration, onDone])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="
                    fixed inset-0 z-[200]
                    flex items-center justify-center
                    bg-black/70
                    px-4
                    "
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 12 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -8 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="
                        flex flex-col items-center
                        rounded-3xl
                        bg-card
                        border border-success/20
                        px-10 py-10
                        shadow-2xl
                        text-center
                        max-w-sm w-full
                        "
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
                            className="relative flex items-center justify-center mb-5"
                        >
                            {/* Pulsing ring */}
                            <motion.span
                                initial={{ scale: 0.6, opacity: 0.6 }}
                                animate={{ scale: 1.8, opacity: 0 }}
                                transition={{ duration: 1.1, repeat: 1, ease: 'easeOut' }}
                                className="absolute inline-flex h-16 w-16 rounded-full bg-success/40"
                            />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success/15 border border-success/30">
                                <motion.div
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
                                >
                                    <Check className="text-success" size={30} strokeWidth={3} />
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.h3
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-lg font-bold text-foreground"
                        >
                            {title}
                        </motion.h3>

                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.22 }}
                                className="text-sm text-muted-foreground mt-1.5"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
