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

            bg-card
            border-b border-border
            shadow-sm
            "
        >

            {/* Left */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Dashboard
                </h1>

                <p className="text-sm text-muted-foreground">
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
                        text-muted-foreground
                        "
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="
                        w-72
                        rounded-xl
                        border
                        border-border
                        bg-card
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-foreground
                        outline-none
                        focus:border-primary/40
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
                    bg-card
                    border
                    border-border
                    text-muted-foreground
                    hover:text-foreground
                    hover:border-primary/20
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
                        bg-destructive
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
                    bg-card
                    border
                    border-border
                    px-3
                    py-2
                    hover:border-primary/20
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
                        <p className="text-sm font-medium text-foreground">
                            Admin
                        </p>

                        <p className="text-xs text-muted-foreground">
                            System Manager
                        </p>
                    </div>

                    <ChevronDown
                        size={16}
                        className="text-muted-foreground"
                    />
                </button>

            </div>
        </div>
    )
}