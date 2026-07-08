'use client'

import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface Props {
    show: boolean
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    tone?: 'success' | 'destructive'
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    show,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    loading = false,
    tone = 'success',
    onConfirm,
    onCancel
}: Props) {

    const toneClasses = tone === 'success'
        ? {
            iconWrap: 'bg-success/15 border-success/30 text-success',
            confirmBtn: 'bg-success text-white hover:bg-success/90'
        }
        : {
            iconWrap: 'bg-destructive/15 border-destructive/30 text-destructive',
            confirmBtn: 'bg-destructive text-white hover:bg-destructive/90'
        }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="
                    fixed inset-0 z-[210]
                    flex items-end sm:items-center justify-center
                    bg-black/70
                    p-0 sm:p-4
                    "
                    onClick={() => !loading && onCancel()}
                >
                    <motion.div
                        initial={{ y: 30, opacity: 0, scale: 0.97 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        onClick={(e) => e.stopPropagation()}
                        className="
                        w-full sm:w-[420px]
                        rounded-t-3xl sm:rounded-3xl
                        bg-card
                        border border-primary/10
                        p-6
                        text-center
                        "
                    >
                        <div className={`
                            mx-auto mb-4 flex h-14 w-14 items-center justify-center
                            rounded-full border ${toneClasses.iconWrap}
                        `}>
                            <AlertTriangle size={26} />
                        </div>

                        <h2 className="text-lg font-bold text-foreground">
                            {title}
                        </h2>

                        {description && (
                            <p className="text-muted-foreground text-sm mt-2">
                                {description}
                            </p>
                        )}

                        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-center gap-3">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="
                                w-full sm:w-auto
                                px-5 py-2.5
                                rounded-xl
                                bg-secondary
                                text-foreground
                                font-medium
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                "
                            >
                                {cancelLabel}
                            </button>

                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className={`
                                w-full sm:w-auto
                                px-5 py-2.5
                                rounded-xl
                                font-medium
                                flex items-center justify-center gap-2
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                transition-colors
                                ${toneClasses.confirmBtn}
                                `}
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? 'Please wait…' : confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
