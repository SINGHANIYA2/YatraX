'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Props {
    onClose: () => void
    onSubmit: (reason: string) => void
}

export default function RejectModal({
    onClose,
    onSubmit
}: Props) {

    const [reason, setReason] =
        useState('')

    return (
        <div
            className="
            fixed inset-0 z-[110]
            flex items-center justify-center
            bg-black/70
            backdrop-blur-sm
            "
        >
            <div
                className="
                w-[500px]
                rounded-3xl
                bg-[#071427]
                border
                border-blue-500/10
                p-6
                "
            >

                <div className="flex items-center justify-between">

                    <div>
                        <h2
                            className="
                            text-xl
                            font-bold
                            text-white
                            "
                        >
                            Reject Application
                        </h2>

                        <p className="text-slate-400 text-sm">
                            Provide a rejection reason
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                        p-2
                        rounded-lg
                        hover:bg-slate-800
                        text-slate-400
                        "
                    >
                        <X size={18} />
                    </button>

                </div>

                <textarea
                    value={reason}
                    onChange={(e) =>
                        setReason(e.target.value)
                    }
                    placeholder="
                    Example:
                    Driving license image is unclear
                    "
                    className="
                    mt-5
                    h-36
                    w-full
                    resize-none
                    rounded-xl
                    bg-slate-900
                    border
                    border-slate-800
                    p-4
                    text-white
                    outline-none
                    "
                />

                <div
                    className="
                    mt-5
                    flex
                    justify-end
                    gap-3
                    "
                >
                    <button
                        onClick={onClose}
                        className="
                        px-4
                        py-2
                        rounded-xl
                        bg-slate-800
                        text-white
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() =>
                            onSubmit(reason)
                        }
                        className="
                        px-4
                        py-2
                        rounded-xl
                        bg-red-500
                        text-white
                        "
                    >
                        Reject Application
                    </button>

                </div>

            </div>
        </div>
    )
}