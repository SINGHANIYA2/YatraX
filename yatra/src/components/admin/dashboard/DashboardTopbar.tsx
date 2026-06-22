'use client'

import { Bell, Search, ChevronDown } from 'lucide-react'

export default function AdminTopbar() {
    return (
        <div
            className="
             sticky
            top-0
            z-50
            h-21
            px-8
            flex
            items-center
            justify-between

            bg-[#071427]
            border-b border-slate-800
            shadow-[0_4px_20px_rgba(0,0,0,0.25)]

            border-b
            border-blue-500/10
            "
        >

            {/* Left */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Dashboard
                </h1>

                <p className="text-sm text-slate-400">
                    Welcome back, Admin
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <div className="relative">
                    <Search
                        size={18}
                        className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-500
                        "
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="
                        w-72
                        rounded-xl
                        border
                        border-slate-800
                        bg-[#071427]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        focus:border-blue-500/40
                        "
                    />
                </div>

                {/* Notification */}
                <button
                    className="
                    relative
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#071427]
                    border
                    border-slate-800
                    text-slate-300
                    hover:text-white
                    hover:border-blue-500/20
                    transition
                    "
                >
                    <Bell size={18} />

                    <span
                        className="
                        absolute
                        right-3
                        top-3
                        h-2
                        w-2
                        rounded-full
                        bg-red-500
                        "
                    />
                </button>

                {/* Profile */}
                <button
                    className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    bg-[#071427]
                    border
                    border-slate-800
                    px-3
                    py-2
                    hover:border-blue-500/20
                    transition
                    "
                >
                    <img
                        src="https://i.pravatar.cc/100?img=12"
                        alt="Admin"
                        className="
                        h-10
                        w-10
                        rounded-full
                        "
                    />

                    <div className="text-left">
                        <p className="text-sm font-medium text-white">
                            Admin
                        </p>

                        <p className="text-xs text-slate-400">
                            System Manager
                        </p>
                    </div>

                    <ChevronDown
                        size={16}
                        className="text-slate-500"
                    />
                </button>

            </div>
        </div>
    )
}