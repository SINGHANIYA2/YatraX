'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
    onClose: () => void
    onSubmit: (reason: string) => void
    loading?: boolean
}

export default function RejectModal({
    onClose,
    onSubmit,
    loading = false
}: Props) {

    const [reason, setReason] = useState('')

    return (
        <div
            className="
            fixed inset-0 z-[110]
            flex items-end sm:items-center justify-center
            bg-black/70
            p-0 sm:p-4
            "
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.22 }}
                className="
                w-full sm:w-[480px]
                rounded-t-3xl sm:rounded-3xl
                bg-card
                border
                border-primary/10
                p-5 sm:p-6
                "
            >

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Reject Application
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Provide a rejection reason
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X size={18} />
                    </button>
                </div>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Example: Driving license image is unclear"
                    disabled={loading}
                    className="
                    mt-5
                    h-32
                    w-full
                    resize-none
                    rounded-xl
                    bg-background
                    border
                    border-border
                    p-4
                    text-foreground
                    outline-none
                    text-sm
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    "
                />

                <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="
                        w-full sm:w-auto
                        px-4 py-2.5
                        rounded-xl
                        bg-secondary
                        text-foreground
                        font-medium
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSubmit(reason)}
                        disabled={!reason.trim() || loading}
                        className="
                        w-full sm:w-auto
                        px-4 py-2.5
                        rounded-xl
                        bg-destructive
                        text-white
                        font-medium
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        flex items-center justify-center gap-2
                        "
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Rejecting…' : 'Reject Application'}
                    </button>
                </div>

            </motion.div>
        </div>
    )
}
