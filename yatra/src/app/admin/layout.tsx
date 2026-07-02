import AdminLayout from '@/components/admin/layout/AdminLayout'
import AdminTopbar from '@/components/admin/dashboard/DashboardTopbar'

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminLayout>
            <div className="flex-1 flex flex-col">

                <main
                    className="
            flex-1
            overflow-y-auto
            bg-background
          "
                >
                    {children}
                </main>
            </div>
        </AdminLayout>
    )
}

