import {
    LayoutDashboard,
    Map,
    Truck,
    Users,
    IndianRupee,
    TriangleAlert,
    Settings,
    FileCheck
} from "lucide-react"

export const adminMenu = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },

    {
        section: "Operations",
    },

    // {
    //     title: "Live Tracking",
    //     href: "/admin/tracking",
    //     icon: Map,
    // },

    {
        title: "Fleet Management",
        href: "/admin/fleet",
        icon: Truck,
    },

    {
        title: "Drivers",
        href: "/admin/drivers",
        icon: Users,
    },
    {
        title: "Applications",
        href: "/admin/applications",
        icon: FileCheck
    },
    {
        section: "Insights",
    },

    {
        title: "Revenue",
        href: "/admin/revenue",
        icon: IndianRupee,
    },

    // {
    //     title: "Alerts",
    //     href: "/admin/alerts",
    //     icon: TriangleAlert,
    // },

    {
        section: "Settings",
    },

    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
]