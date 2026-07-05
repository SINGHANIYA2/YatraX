'use client'

import { motion, AnimatePresence } from "motion/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { adminMenu } from "./adminMenu"

/* ─── Sidebar content (shared between desktop & mobile) ─── */
function SidebarContent({
    collapsed,
    onLinkClick,
}: {
    collapsed: boolean
    onLinkClick?: () => void
}) {
    const pathname = usePathname()

    return (
        <div className="px-3 py-4 overflow-y-auto h-full">
            {adminMenu.map((item, index) => {
                if ("section" in item) {
                    return !collapsed ? (
                        <div key={index}>
                            <p className="mt-7 mb-2 px-3 text-[11px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
                                {item.section}
                            </p>
                        </div>
                    ) : (
                        <div key={index} className="mt-5 mb-1 px-3">
                            <div className="h-px bg-border/50" />
                        </div>
                    )
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
                        onClick={onLinkClick}
                        title={collapsed ? item.title : undefined}
                        className={`
                            group relative flex items-center gap-3 font-medium tracking-wide
                            rounded-xl px-4 py-3 mb-1 transition-all duration-200
                            ${isActive
                                ? "bg-secondary/80 text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                            }
                            ${collapsed ? "justify-center px-3" : ""}
                        `}
                    >
                        <Icon size={20} className="flex-shrink-0" />
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="whitespace-nowrap text-sm"
                            >
                                {item.title}
                            </motion.span>
                        )}
                        {/* Active indicator */}
                        {isActive && (
                            <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                    </Link>
                )
            })}
        </div>
    )
}

/* ─── Desktop sidebar ───────────────────────────────────── */
function DesktopSidebar({
    collapsed,
    onToggle,
}: {
    collapsed: boolean
    onToggle: () => void
}) {
    return (
        <aside
            className={`
                hidden md:flex flex-col
                h-screen sticky top-0
                bg-background border-r border-primary/10
                transition-all duration-300 flex-shrink-0
                ${collapsed ? "w-[72px]" : "w-64"}
            `}
        >
            {/* Header */}
            <div className="h-[72px] px-4 flex items-center justify-between border-b border-border flex-shrink-0">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.h1
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.2 }}
                            className="text-2xl font-black tracking-tight text-foreground"
                        >
                            Yatra<span className="text-primary">X</span>
                        </motion.h1>
                    )}
                </AnimatePresence>
                <button
                    onClick={onToggle}
                    className={`p-2 rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer transition-colors flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}
                >
                    <Menu size={20} />
                </button>
            </div>

            <SidebarContent collapsed={collapsed} />
        </aside>
    )
}

/* ─── Mobile drawer ─────────────────────────────────────── */
function MobileDrawer({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden"
        else document.body.style.overflow = ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    />
                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-primary/10 flex flex-col md:hidden`}
                    >
                        {/* Header — visible on mobile */}
                        <div className="flex h-[72px] px-4 items-center justify-between bg-card border-b border-border">
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Yatra<span className="text-primary">X</span>
                            </h1>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <SidebarContent collapsed={false} onLinkClick={onClose} />
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}

/* ─── Exported sidebar (renders both desktop + mobile) ─── */
export default function AdminSidebar({
    mobileOpen,
    onMobileClose,
    desktopCollapsed,
    onDesktopToggle,
}: {
    mobileOpen: boolean
    onMobileClose: () => void
    desktopCollapsed: boolean
    onDesktopToggle: () => void
}) {
    return (
        <>
            <DesktopSidebar collapsed={desktopCollapsed} onToggle={onDesktopToggle} />
            <MobileDrawer open={mobileOpen} onClose={onMobileClose} />
        </>
    )
}
