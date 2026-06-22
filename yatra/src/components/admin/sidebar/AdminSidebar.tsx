'use client'

import { motion, AnimatePresence } from "motion/react"
import { usePathname } from "next/navigation"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import { adminMenu } from "./adminMenu"

import { Manrope } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
});


export default function AdminSidebar() {
    const pathname = usePathname()


    const [collapsed, setCollapsed] =
        useState(false)



    return (
        <aside
            className={`
                ${manrope.className}
                h-screen
                sticky
                top-0
                bg-gradient-to-b
                from-[#071427]
                to-[#04101f]
                border-r
                border-blue-500/10
                transition-all
                duration-300
                font-sans
                ${collapsed ? 'w-20' : 'w-64'}
            `}
        >
            {/* header */}

            <div className="h-21 px-4 flex items-center justify-between border-b border-slate-800">

                {!collapsed && (
                    <motion.h1
                        initial={{
                            opacity: 0,
                            x: -20
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        exit={{
                            opacity: 0,
                            x: -20
                        }}
                        transition={{
                            duration: 0.3
                        }}
                        className="
                                text-3xl
                                font-black
                                tracking-tight
                                text-white
                                "
                    >
                        Yatra
                        <span className="text-blue-500">X</span>
                    </motion.h1>
                )}

                <button
                    onClick={() =>
                        setCollapsed(prev => !prev)
                    }
                    className="
                        p-2
                        rounded-lg
                        text-slate-400
                        hover:bg-slate-800
                        cursor-pointer
                    "
                >
                    <Menu size={20} />
                </button>

            </div>

            {/* menu */}

            <div className="px-3 py-4">

                {adminMenu.map((item, index) => {

                    if ("section" in item) {
                        return !collapsed ? (
                            // <div>
                            <div key={index}>
                                {!collapsed && (
                                    <motion.p
                                        initial={false}
                                        className="
                                            mt-7
                                            mb-2
                                            px-3
                                            text-[11px]
                                            font-normal
                                            uppercase
                                            tracking-[0.18em]
                                            text-slate-500
                                            
                                            "
                                    >
                                        {item.section}
                                    </motion.p>
                                )}
                            </div>
                        ) : null
                    }

                    const Icon = item.icon

                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                            group
                            relative
                            flex
                            items-center
                            gap-3
                            font-medium
                            font-sans
                            tracking-wide
                            rounded-xl
                            px-4
                            py-3
                            mb-1
                            transition-all
                            duration-200
                             ${isActive
                                    ? `
                                    bg-slate-800/80
                                    text-white
                                    shadow-[0_0_15px_rgba(59,130,246,.08)]
                                    `
                                    : `
                                    text-slate-300
                                    hover:bg-slate-800/70
                                    hover:text-white
                                    `
                                }

                            `}
                        >
                            {collapsed && <Icon size={20.4} />}

                            {!collapsed && (
                                <motion.div
                                    className="flex items-center gap-3"
                                    layout
                                >
                                    <Icon size={20} />

                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.title}
                                    </motion.span>
                                </motion.div>
                            )}
                        </Link>
                    )
                })}

            </div>

        </aside>
    )
}