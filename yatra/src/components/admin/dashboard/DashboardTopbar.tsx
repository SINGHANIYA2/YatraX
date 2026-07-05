'use client'

import { Bell, Search, Settings } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Link from 'next/link'
import useGetAdminMe from '@/hooks/useGetAdminMe'

export default function AdminTopbar() {
    useGetAdminMe()
    const admin = useSelector((state: RootState) => state.admin.adminData)

    const initials = admin?.name
        ? admin.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'A'

    return (
       <div className="hidden font-sans md:flex sticky top-0 z-50 h-[72px] px-6 items-center justify-between bg-card border-b border-border shadow-sm">
            {/* Left */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back, {admin?.name?.split(' ')[0] ?? 'Admin'}
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Search — hidden on small topbar sizes */}
                <div className="relative hidden lg:block">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search…"
                        className="w-60 rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary/40 transition-colors"
                    />
                </div>

                {/* Bell */}
                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20 transition">
                    <Bell size={17} />
                    <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                </button>

                {/* Profile chip */}
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-2.5 rounded-xl bg-card border border-border px-3 py-2 hover:border-primary/20 transition"
                >
                    {admin?.profilePhoto?.url ? (
                        <img
                            src={admin.profilePhoto.url}
                            alt={admin.name}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                            {initials}
                        </div>
                    )}
                </Link>
            </div>
        </div>
    )
}