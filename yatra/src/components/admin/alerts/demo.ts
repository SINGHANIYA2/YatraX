export const alertStats = [
    {
        title: "Total Alerts",
        value: 24,
    },
    {
        title: "Critical",
        value: 5,
    },
    {
        title: "Warning",
        value: 11,
    },
    {
        title: "Resolved",
        value: 8,
    },
]

export const alerts = [
    {
        id: "ALT001",
        vehicle: "JH01AB1234",
        type: "Maintenance",
        severity: "Warning",
        message: "Engine service due in 5 days",
        time: "10 min ago",
    },
    {
        id: "ALT002",
        vehicle: "JH01CT4567",
        type: "Delay",
        severity: "Critical",
        message: "Vehicle running 25 min late",
        time: "18 min ago",
    },
    {
        id: "ALT003",
        vehicle: "JH01MN7890",
        type: "Fuel",
        severity: "Warning",
        message: "Fuel level below 15%",
        time: "30 min ago",
    },
    {
        id: "ALT004",
        vehicle: "JH01TR3456",
        type: "Route",
        severity: "Resolved",
        message: "Vehicle back on assigned route",
        time: "1 hr ago",
    },
]