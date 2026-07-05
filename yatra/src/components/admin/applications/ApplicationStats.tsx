'use client'

import {
    Clock3,
    CheckCircle2,
    XCircle,
    FileText
} from 'lucide-react'

import ApplicationStatsCard from './ApplicationStatsCard'

interface Props {
    applications: any[]
}

export default function ApplicationStats({ applications }: Props) {

    const pending =
        applications.filter(
            a => a.status === 'pending'
        ).length

    const approved =
        applications.filter(
            a => a.status === 'approved'
        ).length

    const rejected =
        applications.filter(
            a => a.status === 'rejected'
        ).length

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

            <ApplicationStatsCard
                title="Total Applications"
                value={applications.length}
                icon={FileText}
                iconColor="text-primary"
            />

            <ApplicationStatsCard
                title="Pending"
                value={pending}
                icon={Clock3}
                iconColor="text-warning"
            />

            <ApplicationStatsCard
                title="Approved"
                value={approved}
                icon={CheckCircle2}
                iconColor="text-success"
            />

            <ApplicationStatsCard
                title="Rejected"
                value={rejected}
                icon={XCircle}
                iconColor="text-destructive"
            />

        </div>
    )
}
