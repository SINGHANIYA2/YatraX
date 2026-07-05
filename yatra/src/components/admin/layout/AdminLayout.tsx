'use client'

import { useState } from 'react'
import AdminSidebar from '../sidebar/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [desktopCollapsed, setDesktopCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
                desktopCollapsed={desktopCollapsed}
                onDesktopToggle={() => setDesktopCollapsed(p => !p)}
            />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile topbar strip with hamburger */}
                <div className="md:hidden flex items-center gap-3 h-[72px] px-4 border-b border-border bg-card flex-shrink-0 sticky top-0 z-30">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-secondary cursor-pointer transition-colors"
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-black tracking-tight text-foreground">
                        Yatra<span className="text-primary">X</span>
                    </h1>
                </div>
                <main className="flex-1 overflow-y-auto bg-background">
                    {children}
                </main>
            </div>
        </div>
    )
}