'use client'

import AdminSidebar from '../sidebar/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#030712]">

            <AdminSidebar />

            <div className="flex-1">
                {children}
            </div>

        </div>
    )
}